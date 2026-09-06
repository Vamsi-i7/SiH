import { CreateUserDataData, UpdateUserData, DeleteUserData, GetCurrentUserData, ListAllUsersData, CreateProjectData, CreateProjectVariables, UpdateProjectData, UpdateProjectVariables, DeleteProjectData, DeleteProjectVariables, GetProjectData, GetProjectVariables, ListProjectsData, CreateTaskData, CreateTaskVariables, UpdateTaskData, UpdateTaskVariables, DeleteTaskData, DeleteTaskVariables, GetTaskData, GetTaskVariables, ListTasksData, CreateCommentData, CreateCommentVariables, UpdateCommentData, UpdateCommentVariables, DeleteCommentData, DeleteCommentVariables, GetCommentData, GetCommentVariables, ListCommentsData, JoinProjectData, JoinProjectVariables, UpdateMemberRoleData, UpdateMemberRoleVariables, LeaveProjectData, LeaveProjectVariables, GetProjectMemberData, GetProjectMemberVariables, ListProjectMembersData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUserData(options?: useDataConnectMutationOptions<CreateUserDataData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserDataData, undefined>;
export function useCreateUserData(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserDataData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserDataData, undefined>;

export function useUpdateUser(options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, void>): UseDataConnectMutationResult<UpdateUserData, undefined>;
export function useUpdateUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, void>): UseDataConnectMutationResult<UpdateUserData, undefined>;

export function useDeleteUser(options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, void>): UseDataConnectMutationResult<DeleteUserData, undefined>;
export function useDeleteUser(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, void>): UseDataConnectMutationResult<DeleteUserData, undefined>;

export function useGetCurrentUser(options?: useDataConnectQueryOptions<GetCurrentUserData>): UseDataConnectQueryResult<GetCurrentUserData, undefined>;
export function useGetCurrentUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetCurrentUserData>): UseDataConnectQueryResult<GetCurrentUserData, undefined>;

export function useListAllUsers(options?: useDataConnectQueryOptions<ListAllUsersData>): UseDataConnectQueryResult<ListAllUsersData, undefined>;
export function useListAllUsers(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllUsersData>): UseDataConnectQueryResult<ListAllUsersData, undefined>;

export function useCreateProject(options?: useDataConnectMutationOptions<CreateProjectData, FirebaseError, CreateProjectVariables>): UseDataConnectMutationResult<CreateProjectData, CreateProjectVariables>;
export function useCreateProject(dc: DataConnect, options?: useDataConnectMutationOptions<CreateProjectData, FirebaseError, CreateProjectVariables>): UseDataConnectMutationResult<CreateProjectData, CreateProjectVariables>;

export function useUpdateProject(options?: useDataConnectMutationOptions<UpdateProjectData, FirebaseError, UpdateProjectVariables>): UseDataConnectMutationResult<UpdateProjectData, UpdateProjectVariables>;
export function useUpdateProject(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateProjectData, FirebaseError, UpdateProjectVariables>): UseDataConnectMutationResult<UpdateProjectData, UpdateProjectVariables>;

export function useDeleteProject(options?: useDataConnectMutationOptions<DeleteProjectData, FirebaseError, DeleteProjectVariables>): UseDataConnectMutationResult<DeleteProjectData, DeleteProjectVariables>;
export function useDeleteProject(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteProjectData, FirebaseError, DeleteProjectVariables>): UseDataConnectMutationResult<DeleteProjectData, DeleteProjectVariables>;

export function useGetProject(vars: GetProjectVariables, options?: useDataConnectQueryOptions<GetProjectData>): UseDataConnectQueryResult<GetProjectData, GetProjectVariables>;
export function useGetProject(dc: DataConnect, vars: GetProjectVariables, options?: useDataConnectQueryOptions<GetProjectData>): UseDataConnectQueryResult<GetProjectData, GetProjectVariables>;

export function useListProjects(options?: useDataConnectQueryOptions<ListProjectsData>): UseDataConnectQueryResult<ListProjectsData, undefined>;
export function useListProjects(dc: DataConnect, options?: useDataConnectQueryOptions<ListProjectsData>): UseDataConnectQueryResult<ListProjectsData, undefined>;

export function useCreateTask(options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;
export function useCreateTask(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;

export function useUpdateTask(options?: useDataConnectMutationOptions<UpdateTaskData, FirebaseError, UpdateTaskVariables>): UseDataConnectMutationResult<UpdateTaskData, UpdateTaskVariables>;
export function useUpdateTask(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTaskData, FirebaseError, UpdateTaskVariables>): UseDataConnectMutationResult<UpdateTaskData, UpdateTaskVariables>;

export function useDeleteTask(options?: useDataConnectMutationOptions<DeleteTaskData, FirebaseError, DeleteTaskVariables>): UseDataConnectMutationResult<DeleteTaskData, DeleteTaskVariables>;
export function useDeleteTask(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteTaskData, FirebaseError, DeleteTaskVariables>): UseDataConnectMutationResult<DeleteTaskData, DeleteTaskVariables>;

export function useGetTask(vars: GetTaskVariables, options?: useDataConnectQueryOptions<GetTaskData>): UseDataConnectQueryResult<GetTaskData, GetTaskVariables>;
export function useGetTask(dc: DataConnect, vars: GetTaskVariables, options?: useDataConnectQueryOptions<GetTaskData>): UseDataConnectQueryResult<GetTaskData, GetTaskVariables>;

export function useListTasks(options?: useDataConnectQueryOptions<ListTasksData>): UseDataConnectQueryResult<ListTasksData, undefined>;
export function useListTasks(dc: DataConnect, options?: useDataConnectQueryOptions<ListTasksData>): UseDataConnectQueryResult<ListTasksData, undefined>;

export function useCreateComment(options?: useDataConnectMutationOptions<CreateCommentData, FirebaseError, CreateCommentVariables>): UseDataConnectMutationResult<CreateCommentData, CreateCommentVariables>;
export function useCreateComment(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCommentData, FirebaseError, CreateCommentVariables>): UseDataConnectMutationResult<CreateCommentData, CreateCommentVariables>;

export function useUpdateComment(options?: useDataConnectMutationOptions<UpdateCommentData, FirebaseError, UpdateCommentVariables>): UseDataConnectMutationResult<UpdateCommentData, UpdateCommentVariables>;
export function useUpdateComment(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateCommentData, FirebaseError, UpdateCommentVariables>): UseDataConnectMutationResult<UpdateCommentData, UpdateCommentVariables>;

export function useDeleteComment(options?: useDataConnectMutationOptions<DeleteCommentData, FirebaseError, DeleteCommentVariables>): UseDataConnectMutationResult<DeleteCommentData, DeleteCommentVariables>;
export function useDeleteComment(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteCommentData, FirebaseError, DeleteCommentVariables>): UseDataConnectMutationResult<DeleteCommentData, DeleteCommentVariables>;

export function useGetComment(vars: GetCommentVariables, options?: useDataConnectQueryOptions<GetCommentData>): UseDataConnectQueryResult<GetCommentData, GetCommentVariables>;
export function useGetComment(dc: DataConnect, vars: GetCommentVariables, options?: useDataConnectQueryOptions<GetCommentData>): UseDataConnectQueryResult<GetCommentData, GetCommentVariables>;

export function useListComments(options?: useDataConnectQueryOptions<ListCommentsData>): UseDataConnectQueryResult<ListCommentsData, undefined>;
export function useListComments(dc: DataConnect, options?: useDataConnectQueryOptions<ListCommentsData>): UseDataConnectQueryResult<ListCommentsData, undefined>;

export function useJoinProject(options?: useDataConnectMutationOptions<JoinProjectData, FirebaseError, JoinProjectVariables>): UseDataConnectMutationResult<JoinProjectData, JoinProjectVariables>;
export function useJoinProject(dc: DataConnect, options?: useDataConnectMutationOptions<JoinProjectData, FirebaseError, JoinProjectVariables>): UseDataConnectMutationResult<JoinProjectData, JoinProjectVariables>;

export function useUpdateMemberRole(options?: useDataConnectMutationOptions<UpdateMemberRoleData, FirebaseError, UpdateMemberRoleVariables>): UseDataConnectMutationResult<UpdateMemberRoleData, UpdateMemberRoleVariables>;
export function useUpdateMemberRole(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateMemberRoleData, FirebaseError, UpdateMemberRoleVariables>): UseDataConnectMutationResult<UpdateMemberRoleData, UpdateMemberRoleVariables>;

export function useLeaveProject(options?: useDataConnectMutationOptions<LeaveProjectData, FirebaseError, LeaveProjectVariables>): UseDataConnectMutationResult<LeaveProjectData, LeaveProjectVariables>;
export function useLeaveProject(dc: DataConnect, options?: useDataConnectMutationOptions<LeaveProjectData, FirebaseError, LeaveProjectVariables>): UseDataConnectMutationResult<LeaveProjectData, LeaveProjectVariables>;

export function useGetProjectMember(vars: GetProjectMemberVariables, options?: useDataConnectQueryOptions<GetProjectMemberData>): UseDataConnectQueryResult<GetProjectMemberData, GetProjectMemberVariables>;
export function useGetProjectMember(dc: DataConnect, vars: GetProjectMemberVariables, options?: useDataConnectQueryOptions<GetProjectMemberData>): UseDataConnectQueryResult<GetProjectMemberData, GetProjectMemberVariables>;

export function useListProjectMembers(options?: useDataConnectQueryOptions<ListProjectMembersData>): UseDataConnectQueryResult<ListProjectMembersData, undefined>;
export function useListProjectMembers(dc: DataConnect, options?: useDataConnectQueryOptions<ListProjectMembersData>): UseDataConnectQueryResult<ListProjectMembersData, undefined>;
