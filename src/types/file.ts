interface IFile {
	content?: ArrayBuffer
	id: string
	metadata?: Record<string, unknown>
	name: string
	type: string
	url?: string
}

type FileWithContent = { content: ArrayBuffer } & IFile;
type FileWithUrl = { url: string } & IFile;

export type File = FileWithContent | FileWithUrl;
