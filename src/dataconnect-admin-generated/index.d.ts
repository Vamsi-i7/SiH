import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CreateCommentData {
  comment_insert: Comment_Key;
}

export interface CreateCommentVariables {
  content: string;
  taskId: UUIDString;
}

export interface CreateProjectData {
  project_insert: Project_Key;
}

export interface CreateProjectVariables {
  name: string;
  description?: string | null;
}

export interface CreateTaskData {
  task_insert: Task_Key;
}

export interface CreateTaskVariables {
  title: string;
  status: string;
  projectId: UUIDString;
}

export interface CreateUserDataData {
  user_insert: User_Key;
}

export interface DeleteCommentData {
  comment_delete?: Comment_Key | null;
}

export interface DeleteCommentVariables {
  id: UUIDString;
}

export interface DeleteProjectData {
  project_delete?: Project_Key | null;
}

export interface DeleteProjectVariables {
  id: UUIDString;
}

export interface DeleteTaskData {
  task_delete?: Task_Key | null;
}

export interface DeleteTaskVariables {
  id: UUIDString;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface GetCommentData {
  comment?: {
    content: string;
  };
}

export interface GetCommentVariables {
  id: UUIDString;
}

export interface GetCurrentUserData {
  user?: {
    email: string;
    displayName: string;
  };
}

export interface GetProjectData {
  project?: {
    name: string;
    description?: string | null;
  };
}

export interface GetProjectMemberData {
  projectMember?: {
    role: string;
  };
}

export interface GetProjectMemberVariables {
  projectId: UUIDString;
  userId: UUIDString;
}

export interface GetProjectVariables {
  id: UUIDString;
}

export interface GetTaskData {
  task?: {
    title: string;
    status: string;
  };
}

export interface GetTaskVariables {
  id: UUIDString;
}

export interface JoinProjectData {
  projectMember_insert: ProjectMember_Key;
}

export interface JoinProjectVariables {
  projectId: UUIDString;
  role: string;
}

export interface LeaveProjectData {
  projectMember_delete?: ProjectMember_Key | null;
}

export interface LeaveProjectVariables {
  projectId: UUIDString;
}

export interface ListAllUsersData {
  users: ({
    id: UUIDString;
    displayName: string;
  } & User_Key)[];
}

export interface ListCommentsData {
  comments: ({
    id: UUIDString;
    content: string;
  } & Comment_Key)[];
}

export interface ListProjectMembersData {
  projectMembers: ({
    projectId: UUIDString;
    userId: UUIDString;
    role: string;
  } & ProjectMember_Key)[];
}

export interface ListProjectsData {
  projects: ({
    id: UUIDString;
    name: string;
  } & Project_Key)[];
}

export interface ListTasksData {
  tasks: ({
    id: UUIDString;
    title: string;
  } & Task_Key)[];
}

export interface ProjectMember_Key {
  projectId: UUIDString;
  userId: UUIDString;
  __typename?: 'ProjectMember_Key';
}

export interface Project_Key {
  id: UUIDString;
  __typename?: 'Project_Key';
}

export interface Task_Key {
  id: UUIDString;
  __typename?: 'Task_Key';
}

export interface UpdateCommentData {
  comment_update?: Comment_Key | null;
}

export interface UpdateCommentVariables {
  id: UUIDString;
  content: string;
}

export interface UpdateMemberRoleData {
  projectMember_update?: ProjectMember_Key | null;
}

export interface UpdateMemberRoleVariables {
  projectId: UUIDString;
  role: string;
}

export interface UpdateProjectData {
  project_update?: Project_Key | null;
}

export interface UpdateProjectVariables {
  id: UUIDString;
  name?: string | null;
}

export interface UpdateTaskData {
  task_update?: Task_Key | null;
}

export interface UpdateTaskVariables {
  id: UUIDString;
  status: string;
}

export interface UpdateUserData {
  user_update?: User_Key | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

/** Generated Node Admin SDK operation action function for the 'CreateUserData' Mutation. Allow users to execute without passing in DataConnect. */
export function createUserData(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserDataData>>;
/** Generated Node Admin SDK operation action function for the 'CreateUserData' Mutation. Allow users to pass in custom DataConnect instances. */
export function createUserData(options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserDataData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateUser' Mutation. Allow users to execute without passing in DataConnect. */
export function updateUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateUser(options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteUser' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteUser(options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserData>>;

/** Generated Node Admin SDK operation action function for the 'GetCurrentUser' Query. Allow users to execute without passing in DataConnect. */
export function getCurrentUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetCurrentUserData>>;
/** Generated Node Admin SDK operation action function for the 'GetCurrentUser' Query. Allow users to pass in custom DataConnect instances. */
export function getCurrentUser(options?: OperationOptions): Promise<ExecuteOperationResponse<GetCurrentUserData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllUsers' Query. Allow users to execute without passing in DataConnect. */
export function listAllUsers(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllUsersData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllUsers' Query. Allow users to pass in custom DataConnect instances. */
export function listAllUsers(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllUsersData>>;

/** Generated Node Admin SDK operation action function for the 'CreateProject' Mutation. Allow users to execute without passing in DataConnect. */
export function createProject(dc: DataConnect, vars: CreateProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateProjectData>>;
/** Generated Node Admin SDK operation action function for the 'CreateProject' Mutation. Allow users to pass in custom DataConnect instances. */
export function createProject(vars: CreateProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateProjectData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateProject' Mutation. Allow users to execute without passing in DataConnect. */
export function updateProject(dc: DataConnect, vars: UpdateProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateProjectData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateProject' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateProject(vars: UpdateProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateProjectData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteProject' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteProject(dc: DataConnect, vars: DeleteProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteProjectData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteProject' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteProject(vars: DeleteProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteProjectData>>;

/** Generated Node Admin SDK operation action function for the 'GetProject' Query. Allow users to execute without passing in DataConnect. */
export function getProject(dc: DataConnect, vars: GetProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProjectData>>;
/** Generated Node Admin SDK operation action function for the 'GetProject' Query. Allow users to pass in custom DataConnect instances. */
export function getProject(vars: GetProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProjectData>>;

/** Generated Node Admin SDK operation action function for the 'ListProjects' Query. Allow users to execute without passing in DataConnect. */
export function listProjects(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListProjectsData>>;
/** Generated Node Admin SDK operation action function for the 'ListProjects' Query. Allow users to pass in custom DataConnect instances. */
export function listProjects(options?: OperationOptions): Promise<ExecuteOperationResponse<ListProjectsData>>;

/** Generated Node Admin SDK operation action function for the 'CreateTask' Mutation. Allow users to execute without passing in DataConnect. */
export function createTask(dc: DataConnect, vars: CreateTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateTaskData>>;
/** Generated Node Admin SDK operation action function for the 'CreateTask' Mutation. Allow users to pass in custom DataConnect instances. */
export function createTask(vars: CreateTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateTaskData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateTask' Mutation. Allow users to execute without passing in DataConnect. */
export function updateTask(dc: DataConnect, vars: UpdateTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateTaskData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateTask' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateTask(vars: UpdateTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateTaskData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteTask' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteTask(dc: DataConnect, vars: DeleteTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteTaskData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteTask' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteTask(vars: DeleteTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteTaskData>>;

/** Generated Node Admin SDK operation action function for the 'GetTask' Query. Allow users to execute without passing in DataConnect. */
export function getTask(dc: DataConnect, vars: GetTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetTaskData>>;
/** Generated Node Admin SDK operation action function for the 'GetTask' Query. Allow users to pass in custom DataConnect instances. */
export function getTask(vars: GetTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetTaskData>>;

/** Generated Node Admin SDK operation action function for the 'ListTasks' Query. Allow users to execute without passing in DataConnect. */
export function listTasks(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListTasksData>>;
/** Generated Node Admin SDK operation action function for the 'ListTasks' Query. Allow users to pass in custom DataConnect instances. */
export function listTasks(options?: OperationOptions): Promise<ExecuteOperationResponse<ListTasksData>>;

/** Generated Node Admin SDK operation action function for the 'CreateComment' Mutation. Allow users to execute without passing in DataConnect. */
export function createComment(dc: DataConnect, vars: CreateCommentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateCommentData>>;
/** Generated Node Admin SDK operation action function for the 'CreateComment' Mutation. Allow users to pass in custom DataConnect instances. */
export function createComment(vars: CreateCommentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateCommentData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateComment' Mutation. Allow users to execute without passing in DataConnect. */
export function updateComment(dc: DataConnect, vars: UpdateCommentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateCommentData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateComment' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateComment(vars: UpdateCommentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateCommentData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteComment' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteComment(dc: DataConnect, vars: DeleteCommentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteCommentData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteComment' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteComment(vars: DeleteCommentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteCommentData>>;

/** Generated Node Admin SDK operation action function for the 'GetComment' Query. Allow users to execute without passing in DataConnect. */
export function getComment(dc: DataConnect, vars: GetCommentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetCommentData>>;
/** Generated Node Admin SDK operation action function for the 'GetComment' Query. Allow users to pass in custom DataConnect instances. */
export function getComment(vars: GetCommentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetCommentData>>;

/** Generated Node Admin SDK operation action function for the 'ListComments' Query. Allow users to execute without passing in DataConnect. */
export function listComments(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListCommentsData>>;
/** Generated Node Admin SDK operation action function for the 'ListComments' Query. Allow users to pass in custom DataConnect instances. */
export function listComments(options?: OperationOptions): Promise<ExecuteOperationResponse<ListCommentsData>>;

/** Generated Node Admin SDK operation action function for the 'JoinProject' Mutation. Allow users to execute without passing in DataConnect. */
export function joinProject(dc: DataConnect, vars: JoinProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<JoinProjectData>>;
/** Generated Node Admin SDK operation action function for the 'JoinProject' Mutation. Allow users to pass in custom DataConnect instances. */
export function joinProject(vars: JoinProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<JoinProjectData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateMemberRole' Mutation. Allow users to execute without passing in DataConnect. */
export function updateMemberRole(dc: DataConnect, vars: UpdateMemberRoleVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateMemberRoleData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateMemberRole' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateMemberRole(vars: UpdateMemberRoleVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateMemberRoleData>>;

/** Generated Node Admin SDK operation action function for the 'LeaveProject' Mutation. Allow users to execute without passing in DataConnect. */
export function leaveProject(dc: DataConnect, vars: LeaveProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<LeaveProjectData>>;
/** Generated Node Admin SDK operation action function for the 'LeaveProject' Mutation. Allow users to pass in custom DataConnect instances. */
export function leaveProject(vars: LeaveProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<LeaveProjectData>>;

/** Generated Node Admin SDK operation action function for the 'GetProjectMember' Query. Allow users to execute without passing in DataConnect. */
export function getProjectMember(dc: DataConnect, vars: GetProjectMemberVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProjectMemberData>>;
/** Generated Node Admin SDK operation action function for the 'GetProjectMember' Query. Allow users to pass in custom DataConnect instances. */
export function getProjectMember(vars: GetProjectMemberVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProjectMemberData>>;

/** Generated Node Admin SDK operation action function for the 'ListProjectMembers' Query. Allow users to execute without passing in DataConnect. */
export function listProjectMembers(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListProjectMembersData>>;
/** Generated Node Admin SDK operation action function for the 'ListProjectMembers' Query. Allow users to pass in custom DataConnect instances. */
export function listProjectMembers(options?: OperationOptions): Promise<ExecuteOperationResponse<ListProjectMembersData>>;

