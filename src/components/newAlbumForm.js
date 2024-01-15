import React, { useState } from 'react';
import {
  useCreateAlbumMutation,
  useUpdateAlbumMutation,
  useGetAlbumsQuery,
  useDeleteAlbumMutation,
} from '../services/jsonServerApi';

export default function NewAlbumForm() {
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [updateAlbum, { isLoading: isUpdateLoading }] = useUpdateAlbumMutation();
  const [createAlbum, { isLoading: isCreateLoading }] = useCreateAlbumMutation();
  const { data: albums, refetch } = useGetAlbumsQuery(); // Fetch the list of albums
  const [deleteAlbum] = useDeleteAlbumMutation(); // Create a mutation for deleting albums

  const [selectedAlbum, setSelectedAlbum] = useState(null);

  async function submitAlbum(event) {
    event.preventDefault();
    const title = event.target['title'].value;

    if (isUpdateMode) {
      await updateAlbum({ id: selectedAlbum.id, title });
      setIsUpdateMode(false); // Reset to create mode
    } else {
      await createAlbum(title);
    }

    event.target.reset();
    refetch(); // Refetch the list of albums after creating/updating
  }

  async function handleDeleteAlbum(albumId) {
    await deleteAlbum(albumId);
    refetch(); // Refetch the list of albums after deleting
  }

  function setUpdateMode(album) {
    setIsUpdateMode(true);
    setSelectedAlbum(album);

    document.getElementById('title').value = album.title;
  }

  return (
    <div>
      <h3>{isUpdateMode ? 'Update Album' : 'New Album'}</h3>
      <form onSubmit={(e) => submitAlbum(e)}>
        <div>
          <label htmlFor='title'>Title:</label>{' '}
          <input type='text' id='title' />
        </div>

        <br />

        <div>
          <input
            type='submit'
            value={isUpdateMode ? 'Update' : 'Add'}
            disabled={isCreateLoading || isUpdateLoading}
          />
          {(isCreateLoading || isUpdateLoading) && ' Loading...'}
        </div>

        {isUpdateMode && (
          <div>
            <button type='button' onClick={() => setIsUpdateMode(false)}>
              Cancel Update
            </button>
          </div>
        )}
      </form>

      <div>
        <h3>Albums</h3>
        <ul>
          {albums &&
            albums?.products.map((album) => (
              <li key={album.id}>
                {album.title}{' '}
                <button type='button' onClick={() => setUpdateMode(album)}>
                  Update
                </button>
                <button type='button' onClick={() => handleDeleteAlbum(album.id)}>
                  Delete
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
