import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { appendToPlural } from '@/lib/string'
import { deleteImage, getImages } from '@/modules/ecr/actions'
import { Image } from '@/modules/ecr/types'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FormEvent, useEffect, useState } from 'react'
import { DownloadImageComponent } from './download-image'
import { ListFilter, Pencil, TrashIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useECR } from '@/modules/ecr/store'
import { useDynamic } from '@/modules/dynamic/store'
import { Listener } from '@/modules/dynamic/types'
import { toast } from 'sonner'

type ACTION = 'delete' | 'rename'

export function ECRImagesPage() {

  const [name, setName] = useState<string>('')
  const [filteredData, setFilteredData] = useState<Image[]>([])
  const [minSize, setMinSize] = useState<string>('')
  const [maxSize, setMaxSize] = useState<string>('')
  const [currentImage, setCurrentImage] = useState<Image | null>(null)
  const [currentAction, setCurrentAction] = useState<ACTION | null>(null)
  const queryClient = useQueryClient()

  const { setImages } = useECR()
  const { addListener, removeListener } = useDynamic()

  const convertToMB = (size: number) => (size / 1000000)

  const { data: images, isLoading } = useQuery({
    queryKey: ['ecr', 'images'],
    queryFn: async () => {
      const data = await getImages()
      setImages(data.images)
      return data
    },
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (images) {
      setFilteredData(images.images)
    }
  }, [images])

  const handleECR = () => {
    queryClient.invalidateQueries({ queryKey: ['ecr', 'images'] })
    console.log('revalidar imagens...')
  }

  useEffect(() => {
    const listener: Listener = { service: 'ecr', fn: handleECR }
    addListener(listener)
    return () => removeListener(listener)
  }, [])

  const handleFilter = (e: FormEvent) => {
    e.preventDefault()

    if (!images) return false

    let filtered = [...images.images]
    filtered = filtered.filter(image => image.RepoTags[0].toLowerCase().includes(name.toLowerCase()))
    if (minSize.length > 0) {
      filtered = filtered.filter(image => convertToMB(image.Size) >= parseFloat(minSize))
    }
    if (maxSize.length > 0) {
      filtered = filtered.filter(image => convertToMB(image.Size) <= parseFloat(maxSize))
    }
    setFilteredData(filtered)
  }

  const resetActions = () => {
    setCurrentAction(null)
    setCurrentImage(null)
  }

  const handleDelete = async () => {
    if (currentImage == null) return false
    deleteImage({ imageId: currentImage.Id })
    setCurrentAction(null)
    setCurrentImage(null)
    toast.info('Você será notificado(a) assim que a imagem for removida.')
  }

  if (isLoading) {
    return (
      <div>
        Carregando...
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <Dialog open={(currentImage != null && currentAction === 'delete')} onOpenChange={resetActions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmação de remoção</DialogTitle>
            <DialogDescription>
              {currentImage?.RepoTags[0]}
            </DialogDescription>
            <DialogFooter>
              <Button>
                Cancelar
              </Button>
              <Button variant='destructive' onClick={handleDelete}>
                Deletar
              </Button>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <form onSubmit={handleFilter}>
          <CardContent className='grid grid-cols-12 gap-2'>
            <Input
              className='col-span-12 md:col-span-6 lg:col-span-4'
              placeholder='Nome'
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <Input
              className='col-span-12 md:col-span-6 lg:col-span-4'
              placeholder='Tamanho máximo'
              type='number'
              value={maxSize}
              onChange={e => setMaxSize(e.target.value)}
            />
            <Input
              className='col-span-12 md:col-span-6 lg:col-span-4'
              placeholder='Tamanho mínimo'
              type='number'
              value={minSize}
              onChange={e => setMinSize(e.target.value)}
            />
            <Input
              className='col-span-12 md:col-span-6 lg:col-span-4'
              placeholder='Tag *:latest'
            />
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleFilter}
            >
              Filtrar
              <ListFilter className='size-4' />
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Imagens</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='flex items-center justify-end gap-2'>
            <DownloadImageComponent />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                filteredData.map(image => (
                  <TableRow key={image.Id}>
                    <TableCell>{image.Id}</TableCell>
                    <TableCell>{image.RepoDigests[0] ? image.RepoDigests[0].split('@')[0] : image.RepoTags[0]}</TableCell>
                    <TableCell>{convertToMB(image.Size).toFixed(3)}MB</TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge>
                            {image.RepoTags.length} {appendToPlural(image.RepoTags.length, 'Tag')}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent side='left'>
                          {
                            image.RepoTags.map(tag => (
                              <div key={tag}>
                                {tag}
                              </div>
                            ))
                          }
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className='flex items-center gap-2'>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size='icon' variant='outline'>
                            <Pencil className='size-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Renomear</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size='icon' variant='destructive' onClick={() => {
                            setCurrentImage(image)
                            setCurrentAction('delete')
                          }}>
                            <TrashIcon className='size-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Deletar</TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}