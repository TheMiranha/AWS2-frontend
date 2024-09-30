import { mainAPI } from "@/lib/api";
import { Image } from "./types";

export async function getImages(): Promise<{ images: Image[] }> {
  return await mainAPI.get('/ecr').then(res => res.data)
}

export async function downloadImage({ image }: { image: string }): Promise<
  {
    message: string
    success: boolean,
    image: string
  }> {
  return await mainAPI.post('/ecr/download', { image }).then(res => res.data)
}

export async function deleteImage({ imageId }: { imageId: string }): Promise<{ message: string }> {
  return await mainAPI.post('/ecr/delete', { imageId }).then(res => res.data)
}