import MUIDataTable from "mui-datatables";
import "./App.css";
import { useContext, useState } from "react";
import { PostsContext } from "./context/PostsContext";

function App() {
  const { posts, createPost, updatePost, deletePost } =
    useContext(PostsContext);
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    title: "",
    body: "",
    id: "",
  });

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
      await updatePost(formData);
    } else {
      await createPost(formData);
    }
  };

  const handleEdit = (id) => {
    let postToEdit = posts.filter((item) => item.id === id);
    setFormData({
      userId: postToEdit[0].userId,
      title: postToEdit[0].title,
      body: postToEdit[0].body,
      id: postToEdit[0].id,
    });
    setIsUpdate(true);
  };

  const handleDelete = async (id) => {
    await deletePost(id);
  };

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
        data={posts}
        options={options}
      />
    </>
  );
}

export default App;
