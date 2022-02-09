import Link from 'next/link';

export default function Navbar() {
  return <div className="flex flex-row justify-between py-4 px-10 lg:px-24 z-10" data-testid="navbar">
    <Link href="/">
      <div className="text-3xl cursor-pointer" data-testid="title">eni.wien</div>
    </Link>
    <div className="flex flex-col justify-center items-center leading-4 hidden md:block opacity-80 text-right">
      <div className="text-md md:ml-24">kanzlei@eni.wien</div>
      <div className="text-md md:ml-24 hidden">+1 616 4340</div>
    </div>
  </div>;
}
