import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { downloadImage } from '@/modules/ecr/actions'
import { CheckIcon, DownloadIcon, XIcon } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { toast } from 'sonner'

export function DownloadImageComponent() {

  const [name, setName] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)

  const handleDownload = async () => {
    if (name.length === 0) return
    setName('')
    downloadImage({ image: name })
    setOpen(false)
    toast.info('Você será notificado(a) assim que a imagem for baixada.')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleDownload()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size='sm' variant='secondary'>Adicionar imagem <DownloadIcon className='size-4' /></Button>
      </SheetTrigger>
      <SheetContent className='flex flex-col'>
        <form onSubmit={handleSubmit} className='flex-1 flex flex-col'>
          <SheetHeader>
            <SheetTitle>Baixar imagem</SheetTitle>
          </SheetHeader>
          <div className='flex-1'>
            <Input
              placeholder='Imagem'
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <SheetFooter>
            <SheetClose>
              <Button variant='destructive' type='button'>Cancelar <XIcon className='size-4' /></Button>
            </SheetClose>
            <Button variant='secondary' type='submit' onClick={handleDownload}>Baixar <CheckIcon className='size-4' /></Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}