import React, { useState, useEffect } from 'react';
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
  const { data: albums, refetch } = useGetAlbumsQuery();
  const [deleteAlbum] = useDeleteAlbumMutation();
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  // Local state to store albums
  const [localAlbums, setLocalAlbums] = useState([]);

  // Initialize local albums with the data fetched from the API
  useEffect(() => {
    if (albums) {
      console.log(albums,"sethereee")
      setLocalAlbums(albums.products);
    }
  }, [albums]);

  async function submitAlbum(event) {
    event.preventDefault();
    const title = event.target['title'].value;

    if (isUpdateMode) {
      // Update locally
      setLocalAlbums((prevAlbums) =>
        prevAlbums.map((album) =>
          album.id === selectedAlbum.id ? { ...album, title } : album
        )
      );

      // Update on the API
      await updateAlbum({ id: selectedAlbum.id, title });
      setIsUpdateMode(false);
    } else {
      // Create locally
      const newAlbum = { id: Date.now(), title };
      setLocalAlbums((prevAlbums) => [...prevAlbums, newAlbum]);

      // Create on the API
      await createAlbum(title);
    }

    event.target.reset();
    refetch(); // Refetch the list of albums from the API
  }

  async function handleDeleteAlbum(albumId) {
    // Delete locally
    setLocalAlbums((prevAlbums) => prevAlbums.filter((album) => album.id !== albumId));

    // Delete on the API
    await deleteAlbum(albumId);
    refetch(); // Refetch the list of albums from the API
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
          {localAlbums.map((album) => (
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
