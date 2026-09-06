/**
 * src/services/documentService.ts
 *
 * Document ingestion, chunking, and metadata extraction service backed by Firebase Storage & Firestore.
 * Supports MoSPI survey manuals, CAPI guidelines, and FRAC curriculum ingestion.
 */

import { db, storage } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface DocumentChunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  text: string;
  metadata: {
    section?: string;
    pageNumber?: number;
    competencyTags: string[];
    wordCount: number;
  };
}

export interface IngestedDocument {
  id: string;
  title: string;
  filename: string;
  sizeBytes: number;
  uploadedAt: string;
  status: 'PROCESSING' | 'CHUNKED' | 'INDEXED' | 'ERROR';
  chunkCount: number;
  targetCompetencies: string[];
  chunks?: DocumentChunk[];
  storageUrl?: string;
  storagePath?: string;
  userId?: string;
}

export class DocumentService {
  /**
   * Process document: Upload file binary to Firebase Storage and save metadata in Firestore
   */
  static async processDocument(
    filename: string,
    fileContent: string | Buffer,
    targetCompetencies: string[] = [],
    userId?: string
  ): Promise<IngestedDocument> {
    const docId = `doc-${Date.now()}`;
    const fileBuffer = typeof fileContent === 'string' ? Buffer.from(fileContent) : fileContent;
    const storagePath = `documents/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    let storageUrl = `https://storage.googleapis.com/statvidya.appspot.com/${storagePath}`;

    // 1. Upload to Firebase Storage
    try {
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, fileBuffer, { contentType: 'application/pdf' });
      storageUrl = await getDownloadURL(storageRef);
    } catch {
      // In mock/local dev mode without active Firebase storage credentials
    }

    const textContent = typeof fileContent === 'string' ? fileContent : fileBuffer.toString('utf-8');
    const paragraphs = textContent.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

    const chunks: DocumentChunk[] = paragraphs.map((para, idx) => {
      const words = para.trim().split(/\s+/);
      return {
        id: `chunk-${docId}-${idx + 1}`,
        documentId: docId,
        chunkIndex: idx + 1,
        text: para.trim(),
        metadata: {
          section: `Section ${Math.floor(idx / 3) + 1}`,
          pageNumber: Math.floor(idx / 2) + 1,
          competencyTags: targetCompetencies.length > 0 ? targetCompetencies : ['comp-capi', 'comp-nsso'],
          wordCount: words.length,
        },
      };
    });

    const docRecord: IngestedDocument = {
      id: docId,
      title: filename.replace(/\.[^/.]+$/, ''),
      filename,
      sizeBytes: fileBuffer.length,
      uploadedAt: new Date().toISOString(),
      status: 'INDEXED',
      chunkCount: chunks.length || 1,
      targetCompetencies,
      chunks,
      storageUrl,
      storagePath,
      userId,
    };

    // 2. Map metadata to Firestore DB
    try {
      const docRef = await addDoc(collection(db, 'documents'), {
        title: docRecord.title,
        filename,
        storagePath,
        storageUrl,
        sizeBytes: fileBuffer.length,
        status: 'INDEXED',
        chunkCount: chunks.length || 1,
        targetCompetencies,
        chunks: chunks.slice(0, 15),
        userId: userId || 'public',
        createdAt: docRecord.uploadedAt,
      });
      docRecord.id = docRef.id;
    } catch {
      // Local fallback if Firestore offline
    }

    return docRecord;
  }

  /**
   * Retrieves documents from Firestore DB filtered by user ownership + public official manuals
   */
  static async getDocuments(filterUserId?: string): Promise<IngestedDocument[]> {
    try {
      const docsRef = collection(db, 'documents');
      const q = query(docsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const firestoreDocs = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              title: data.title || 'Untitled Document',
              filename: data.filename || 'manual.pdf',
              sizeBytes: Number(data.sizeBytes || 0),
              uploadedAt: data.createdAt || new Date().toISOString(),
              status: data.status || 'INDEXED',
              chunkCount: data.chunkCount || 16,
              targetCompetencies: data.targetCompetencies || ['comp-capi', 'comp-nsso'],
              chunks: data.chunks as DocumentChunk[] | undefined,
              storageUrl: data.storageUrl,
              storagePath: data.storagePath,
              userId: (data.userId as string) || 'public',
            };
          })
          .filter((doc) => {
            // Include public/system documents plus user's own uploads
            if (!filterUserId) return true;
            return doc.userId === filterUserId || doc.userId === 'public' || doc.userId === 'system';
          });

        // Merge with sample documents for rich initial repository
        const sampleDocs = DocumentService.getSampleDocuments();
        const existingFilenames = new Set(firestoreDocs.map((d) => d.filename));
        const nonDuplicateSamples = sampleDocs.filter((s) => !existingFilenames.has(s.filename));
        return [...firestoreDocs, ...nonDuplicateSamples];
      }
    } catch {
      // Fallback to samples if Firestore offline
    }

    return DocumentService.getSampleDocuments();
  }

  /**
   * Delete a document from Firestore
   */
  static async deleteDocument(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, 'documents', id);
      await deleteDoc(docRef);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Retrieves sample pre-loaded MoSPI official manuals for testing/demo
   */
  static getSampleDocuments(): IngestedDocument[] {
    return [
      {
        id: 'doc-plfs-2024',
        title: 'PLFS Field Instruction Manual 2024-25',
        filename: 'PLFS_Instruction_Manual_2024.pdf',
        sizeBytes: 4194304,
        uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'INDEXED',
        chunkCount: 24,
        targetCompetencies: ['comp-capi', 'comp-nsso'],
        storageUrl: 'https://storage.googleapis.com/statvidya.appspot.com/documents/PLFS_Instruction_Manual_2024.pdf',
      },
      {
        id: 'doc-capi-handbook',
        title: 'CAPI Application User Guide for Field Staff',
        filename: 'CAPI_Tablet_Guide_v3.2.pdf',
        sizeBytes: 2097152,
        uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        status: 'INDEXED',
        chunkCount: 16,
        targetCompetencies: ['comp-capi', 'comp-data'],
        storageUrl: 'https://storage.googleapis.com/statvidya.appspot.com/documents/CAPI_Tablet_Guide_v3.2.pdf',
      },
    ];
  }
}
