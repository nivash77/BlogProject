
import PostDetails from "../app/post/[id]/page";
import { getPostById } from "../../../lib/serverActions";

const Page = async ({ params }) => {
  const post = await getPostById(params.id);
  return <PostDetails id={params.id} initialPost={post} />;
};

export default Page;
