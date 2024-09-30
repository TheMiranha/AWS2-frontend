export type Image = {
  Containers: number
  Created: number
  Id: string
  Labels?: Labels
  ParentId: string
  RepoDigests: string[]
  RepoTags: string[]
  SharedSize: number
  Size: number
  VirtualSize: number
}

type Labels = Record<string, string>
