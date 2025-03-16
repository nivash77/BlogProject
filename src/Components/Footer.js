import Link from "next/link";
export const Footer=()=>{
    return (
      <>
        <footer className="bg-gray-200 text-center p-4 fixed bottom-0 left-0 right-0">
          <Link href='https://github.com/nivash77'><p className="text-gray-600">Made with &#10084; by BlackHeart_Nivash</p></Link>
        </footer>
      </>
    );
}