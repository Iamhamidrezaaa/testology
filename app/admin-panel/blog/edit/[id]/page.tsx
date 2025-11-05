import BlogForm from '@/components/admin/modules/BlogForm'

interface EditBlogPostProps {
  params: {
    id: string
  }
}

export default async function EditBlogPost({ params }: EditBlogPostProps) {
  // TODO: Implement blog post fetching when BlogPost model is added to schema
  return <BlogForm />
}