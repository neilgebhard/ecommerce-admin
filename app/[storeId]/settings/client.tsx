'use client'

import { useState } from 'react'
import { Save, Trash } from 'lucide-react'
import { Store } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import ConfirmDeleteModal from '@/components/confirm-delete-modal'
import ApiAlert from '@/components/api-alert'

const formSchema = z.object({
  name: z.string().min(2).max(50),
})

type Props = {
  store: Store
}

const Client: React.FC<Props> = ({ store }) => {
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: store.name,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      await axios.put(`/api/stores/${store.id}`, values)
      toast.success('Store updated.')
      router.refresh()
    } catch (e) {
      console.error(e)
      toast.error('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/stores/${store.id}`)
      toast.success('Store deleted.')
      router.refresh()
    } catch (e) {
      console.error(e)
      toast.error('Something went wrong.')
      setLoading(false)
    }
  }

  return (
    <>
      <Separator className='my-8' />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 max-w-sm'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder='shadcn' {...field} />
                </FormControl>
                <FormDescription>
                  This is your store&apos;s display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} type='submit'>
            <Save className='mr-2 h-4 w-4' />
            Update Store
          </Button>
        </form>
      </Form>
      <Separator className='my-8' />
      <ApiAlert
        title='NEXT_PUBLIC_API_URL'
        description={`${window?.location?.origin}/api/stores/${store.id}`}
        type='public'
      />
      <Separator className='my-8' />
      <Button
        variant='destructive'
        disabled={loading}
        onClick={() => setOpenModal(true)}
      >
        <Trash className='mr-2 h-4 w-4' />
        Delete Store
      </Button>
      <ConfirmDeleteModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        loading={loading}
        onConfirm={handleDelete}
      />
    </>
  )
}

export default Client
