import MUIDataTable from "mui-datatables";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [isUpdate, setIsUpdate] = useState(false);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    userId: "",
    title: "",
    body: "",
    id: "",
  });
  const url = "https://jsonplaceholder.typicode.com/posts";

  const postColumns = [
    { name: "id", label: "ID", width: 90 },
    { name: "title", label: "Title", width: 150, editable: true },
    { name: "body", label: "Content", width: 150, editable: true },
    {
      name: "actions",
      label: "Actions",
      width: 800,
      editable: true,
      options: {
        customBodyRender: (value, tableMeta) => {
          const id = tableMeta.rowData[0];
          return (
            <div className="button-actions">
              <button
                onClick={() => handleEdit(id)}
                style={{ marginRight: "10px" }}
              >
                Edit
              </button>
              <button onClick={() => handleDelete(id)}>Delete</button>
            </div>
          );
        },
      },
    },
  ];

  const getAllPost = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUpdate) {
      await updatePost();
      setData((postToFind) =>
        postToFind.map((item) =>
          item.id === formData.id ? { ...item, ...formData } : item
        )
      );
    } else {
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
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const json = await response.json();
        setData([...data, json]);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const updatePost = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts/1",
        {
          method: "PUT",
          body: JSON.stringify(formData),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleEdit = (id) => {
    let postToEdit = data.filter((item) => item.id === id);
    setFormData({
      userId: postToEdit[0].userId,
      title: postToEdit[0].title,
      body: postToEdit[0].body,
      id: postToEdit[0].id,
    });
    setIsUpdate(true);
    console.log(`Editar post con id: ${id}`);
  };

  const handleDelete = async (id) => {
    await deletePost(id);
    setData(data.filter((item) => item.id !== id));
  };

  const deletePost = async (id) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log(`Post with id ${id} has been deleted`);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  useEffect(() => {
    getAllPost();
  }, []);

  const options = { setColumnWidth: true, download: false };

  return (
    <>
      <form className="my-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="mainTitle">Add a new post</label>
          <label htmlFor="userId">User ID:</label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="body">Body:</label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
            rows="4"
            cols="50"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <button type="submit">Submit</button>
        </div>
      </form>
      <MUIDataTable
        title="All Posts"
        columns={postColumns}
        data={data}
        options={options}
      />
    </>
  );
}

export default App;
