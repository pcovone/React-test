import { createContext, useEffect, useState } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage"
export const PostsContext = createContext()

const url = "https://jsonplaceholder.typicode.com/posts"

const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([])
  const { readLocalStorage, writeLocalStorage } = useLocalStorage()

  const getAllPost = async () => {
    const existsPosts = readLocalStorage("posts")
    if (existsPosts) {
      setPosts(existsPosts)
      return
    }
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const data = await response.json()
      setPosts(data)
      writeLocalStorage("posts", data)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  useEffect(() => {
    getAllPost()
  }, [])

  const createPost = async (formData) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          userId: formData.userId,
          title: formData.title,
          body: formData.body,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const json = await response.json()
      const jsonWithId = { ...json, id: posts.length + 1 }
      const updatedPosts = [...posts, jsonWithId]
      setPosts(updatedPosts)
      writeLocalStorage("posts", updatedPosts)
      alert("Post created successfully")
    } catch (error) {
      alert("Error creating post")
    }
  }

  const updatePost = async (formData) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${formData.id}`,
        {
          method: "PUT",
          body: JSON.stringify(formData),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      )

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const json = await response.json()
      const updatedPosts = posts.map((post) =>
        post.id === json.id ? { ...json } : post
      )
      setPosts(updatedPosts)
      writeLocalStorage("posts", updatedPosts)
      alert("Post updated successfully")
    } catch (error) {
      alert("Error updating post")
    }
  }

  const deletePost = async (id) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const updatedPosts = posts.filter((post) => post.id !== id)
      setPosts(updatedPosts)
      writeLocalStorage("posts", updatedPosts)
      alert("Post deleted successfully")
    } catch (error) {
      alert("Error deleting post")
    }
  }

  return (
    <PostsContext.Provider
      value={{ posts, createPost, updatePost, deletePost }}
    >
      {children}
    </PostsContext.Provider>
  )
}

export default PostsProvider
