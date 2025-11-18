import { Link } from "react-router-dom";

export default function Credits() {
  return (
    <div className="absolute flex justify-center align-middle bottom-0 left-1/2 -translate-x-1/2 text-neutral-200 bg-black bg-opacity-80">
      <Link
        className="h-min max-h-fit m-2 hover:underline"
        to="https://notaroomba.dev"
      >
        Website
      </Link>
      <p className="m-2">•</p>
      <p className="m-2">NotARoomba</p>
      <p className="m-2">•</p>
      <Link
        className="h-min max-h-fit m-2 hover:underline"
        to="https://github.com/NotARoomba/Asteroids"
      >
        GitHub
      </Link>
    </div>
  );
}
