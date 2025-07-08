import { ConnectMongodb } from '../../../utils/ConnectMongodb';
import PostModel from '../../../../Model/PostModel';

export async function GET() {
  try {
    await ConnectMongodb();
    const categories = await PostModel.distinct('category');
    return Response.json({ categories });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
