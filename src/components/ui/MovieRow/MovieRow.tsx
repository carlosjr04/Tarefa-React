import { MovieCard } from "@/components/home/MovieCard/MovieCard";
import { Carousel } from "../Carousel/Carousel";
import type { MovieLite } from "@/types/movie.types";

export default function MovieRow({ title, movies }: { title: string; movies: MovieLite[] }) {
  if (movies.length === 0) return null
  return (
    <section>
      <h2 className="section-title">{title}</h2>
      <Carousel
        items={movies}
        keyFor={(m) => m.id}
        renderItem={(movie) => <MovieCard movie={movie} showMeta={false} />}
      />
    </section>
  )
}