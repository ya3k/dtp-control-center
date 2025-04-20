"use client"

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { cn } from "@/lib/utils"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  Info,
  ImageIcon,
  Loader2
} from 'lucide-react'
import { useState, useRef } from 'react'
import { Button } from '../ui/button'
import uploadApiRequest from '@/apiRequests/upload'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "../ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import { toast } from 'sonner'

interface TiptapEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function TiptapEditor({ value, onChange, placeholder, className }: TiptapEditorProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left',

      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded max-w-full mx-auto my-4 border border-gray-200 dark:border-gray-700',
          style: 'max-height: 300px; object-fit: contain;'
        },
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: cn(
          "prose dark:prose-invert prose-sm max-w-none focus:outline-none min-h-[150px] p-4",
          !value && !isFocused && "before:content-[attr(data-placeholder)] before:text-gray-400 before:float-left",
          // Add custom styling for different content types
          "prose-headings:border-b prose-headings:border-gray-200 dark:prose-headings:border-gray-700 prose-headings:pb-1 prose-headings:mb-3",
          "prose-h1:text-2xl prose-h1:font-bold prose-h1:text-primary",
          "prose-h2:text-xl prose-h2:font-semibold prose-h2:text-primary/90",
          "prose-p:my-2 prose-p:leading-relaxed",
          "prose-ol:pl-6 prose-ol:my-3 prose-ol:list-decimal prose-ol:marker:text-muted-foreground",
          "prose-ul:pl-6 prose-ul:my-3 prose-ul:list-disc prose-ul:marker:text-muted-foreground"
        ),
        'data-placeholder': placeholder || 'Enter description...',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    enableCoreExtensions: true,
    enablePasteRules: true,
    enableInputRules: true,
    immediatelyRender: false
  })

  if (!editor) {
    return null
  }

  const textSizes = [
    { name: 'Normal', action: () => editor.chain().focus().setParagraph().run() },
    { name: 'Heading 1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { name: 'Heading 2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { name: 'Heading 3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { name: 'Heading 4', action: () => editor.chain().focus().toggleHeading({ level: 4 }).run() },
  ]

  // Get the current text style (paragraph or heading level)
  const getCurrentTextStyle = () => {
    if (editor.isActive('heading', { level: 1 })) return 'Heading 1'
    if (editor.isActive('heading', { level: 2 })) return 'Heading 2'
    if (editor.isActive('heading', { level: 3 })) return 'Heading 3'
    if (editor.isActive('heading', { level: 4 })) return 'Heading 4'
    return 'Normal'
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const files = Array.from(e.target.files)
      setIsUploading(true)
      setUploadProgress(0)

      try {
        // Process each file in sequence
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          
          // Update progress for each file
          setUploadProgress(Math.round(((i) / files.length) * 100))
          
          // Call the upload API from your existing service
          const uploadResponse = await uploadApiRequest.uploadTourImages([file])

          // Check if we got URLs back and use the first one
          if (uploadResponse && uploadResponse.urls && uploadResponse.urls.length > 0) {
            editor
              .chain()
              .focus()
              .setImage({
                src: uploadResponse.urls[0],
                alt: file.name
              })
              .run()
          } else {
            throw new Error('No image URL returned from server')
          }
        }
        
        // Set progress to 100% when done
        setUploadProgress(100)
        
        // Show success message with count of uploaded images
        if (files.length === 1) {
          toast.success("Image uploaded successfully")
        } else {
          toast.success(`${files.length} images uploaded successfully`)
        }
      } catch (error) {
        console.error('Image upload failed:', error)
        toast.error("Image upload failed. Please try again.")
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
        // Clear the input so the same files can be selected again
        if (imageInputRef.current) {
          imageInputRef.current.value = ''
        }
      }
    }
  }

  const addImage = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click()
    }
  }

  return (
    <div
      className={cn(
        "border rounded-md overflow-hidden",
        isFocused && "ring-2 ring-ring ring-offset-background",
        className,
      )}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="bg-background rounded-md shadow-md border border-border flex overflow-hidden"
        >
          <Button
            type="button"
            variant={editor.isActive('bold') ? "default" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="h-8 px-2 py-1"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive('italic') ? "default" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="h-8 px-2 py-1"
          >
            <Italic className="h-4 w-4" />
          </Button>

          <div className="border-l h-8"></div>

          {/* Text styles */}


          <div className="border-l h-8"></div>

          {/* List buttons */}
          <Button
            type="button"
            variant={editor.isActive('bulletList') ? "default" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="h-8 px-2 py-1"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive('orderedList') ? "default" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="h-8 px-2 py-1"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </BubbleMenu>
      )}

      <div className="flex flex-wrap gap-1 p-1 border-b bg-muted/50">
        {/* Text Size Dropdown with tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Type className="h-4 w-4" />
                      <span className="text-xs max-w-[80px] truncate">{getCurrentTextStyle()}</span>
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" sideOffset={5}>
                    {textSizes.map((size, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={size.action}
                        className={cn(
                          "flex items-center gap-1 cursor-pointer",
                          getCurrentTextStyle() === size.name && "bg-accent font-medium"
                        )}>
                        {size.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">
                      Changes apply to current line or selection
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Change text size for current line</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Formatting buttons */}
        <Button
          type="button"
          variant={editor.isActive('bold') ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn("transition-colors")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('italic') ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn("transition-colors")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('bulletList') ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn("transition-colors")}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('orderedList') ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn("transition-colors")}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        {/* Text alignment buttons */}
        <div className="ml-1 border-l pl-1">
          <Button
            type="button"
            variant={editor.isActive({ textAlign: 'left' }) ? "default" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={cn("transition-colors")}
            title="Align left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive({ textAlign: 'center' }) ? "default" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={cn("transition-colors")}
            title="Align center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive({ textAlign: 'right' }) ? "default" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={cn("transition-colors")}
            title="Align right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Image upload button */}
        <div className="ml-1 border-l pl-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addImage}
                  disabled={isUploading}
                  className={cn("transition-colors")}
                >
                  {isUploading ? (
                    <div className="flex items-center gap-1">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {uploadProgress > 0 && (
                        <span className="text-xs">{uploadProgress}%</span>
                      )}
                    </div>
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{isUploading ? "Uploading..." : "Insert images (multiple allowed)"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImageUpload}
            accept="image/png, image/jpeg, image/gif"
            className="hidden"
            multiple
          />
        </div>

        {/* Help button */}
        {/* <div className="ml-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-[300px]">
                <p className="text-xs">
                  Format text by selecting it or placing your cursor in a paragraph.
                  Images will be uploaded to the server.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div> */}
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}