import Link from "next/link";
export const Footer=()=>{
    return (
      <>
        <footer className="bg-white/30 backdrop-blur-sm text-center p-4 fixed bottom-0 left-0 right-0 ">
          <Link href='https://www.linkedin.com/in/nivash-m-2k4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' target="_blank"><p className="text-gray-600">Made with &#10084; by BlackHeart_Nivash</p></Link>
        </footer>
      </>
    );
}