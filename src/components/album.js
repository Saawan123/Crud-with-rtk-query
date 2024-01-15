import { useGetAlbumsQuery } from "../services/jsonServerApi";
import { useState } from "react";
export default function Albums() {
    const [page, setPage] = useState(1);
    const {
        data: albums = [],
        isLoading,
        isFetching,
        isError,
        error,
    } = useGetAlbumsQuery(page);
    console.log(albums, "eventttttt111")
    if (isLoading || isFetching) {
        return <div>loading...</div>;
    }

    if (isError) {
        console.log({ error });
        return <div>{error.status}</div>;
    }

    return (
        <>
            <ul>
                {albums?.products?.map((album) => (
                    <li key={album.id}>
                        {album.id} - {album.title}
                    </li>
                ))}
                {console.log("floe here")}
            </ul>
            <button
                disabled={page?.products <= 1}
                onClick={() => setPage((prev) => prev - 1)}
            >
                Prev
            </button>
            <button
                disabled={albums?.products?.length < 10}
                onClick={() => setPage((prev) => prev + 1)}
            >
                Next
            </button>
        </>
    );
}