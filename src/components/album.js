import React, { useState, useEffect } from "react";
import { useGetAlbumsQuery, useDeleteAlbumMutation } from "../services/jsonServerApi";

export default function Albums() {
  const [page, setPage] = useState(1);
  const { data: albumsData, refetch } = useGetAlbumsQuery(page);
  const [localAlbums, setLocalAlbums] = useState([]);
  const [deleteAlbum] = useDeleteAlbumMutation();

  useEffect(() => {
    if (albumsData) {
      setLocalAlbums(albumsData.products);
    }
  }, [albumsData]);

  async function handleDeleteAlbum(albumId) {
    // Delete locally
    setLocalAlbums((prevAlbums) => prevAlbums.filter((album) => album.id !== albumId));

    // Delete on the API
    await deleteAlbum(albumId);
    refetch(); // Refetch the list of albums from the API
  }

  return (
    <>
      <ul>
        {localAlbums.map((album) => (
          <li key={album.id}>
            {album.id} - {album.title}
            <button onClick={() => handleDeleteAlbum(album.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>
        Prev
      </button>
      <button
        disabled={localAlbums.length < 10}
        onClick={() => setPage((prev) => prev + 1)}
      >
        Next
      </button>
    </>
  );
}
