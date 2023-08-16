"use Client";

import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPost } from "@/lib/actions/thread.action";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {

 const result =  await fetchPost(1,30);
 const user = await currentUser();

 console.log(result);
  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length===0 ?(<p className="no-reasult">
          No Thread found</p>):
          
          (
          <>
          {
            result.posts.map((post)=>(
              <ThreadCard key={post._id} 
              id={post._id} 
              currentUserId={user?.id || ''} 
              parentId={post.parentId} 
              content={post.text}
              author={post.author} 
              community={post.community} 
              createdAt={post.createdAt} 
              comments={post.children}
              />
            ))
          }
          </>
          )}
        
      </section>
    </>
  )
}


