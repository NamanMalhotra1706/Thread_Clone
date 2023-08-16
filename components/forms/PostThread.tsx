"use client";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { ThreadValidation } from "@/lib/validations/thread";
import * as z from "zod";

//import { updateUser } from "@/lib/actions/user.action";
import { usePathname,useRouter } from "next/navigation";
import { createThread } from "@/lib/actions/thread.action";

interface Props {
    user : {
        id:string,
        objectId:string,
        username:string,
        name:string,
        bio:string,
        image:string
    };
    btnTitle:string;
}

    
  

function PostThread({ userId }:{userId: string}){

  const router = useRouter();
  const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(ThreadValidation), // Come from lib --> User Validation
        defaultValues:{
            thread:'',
            accountId:userId,
        }
        });

        const onSubmit= async (values:z.infer<typeof ThreadValidation>)=>{
            await createThread({
                text:values.thread,
                author:userId,
                communityId:null,
                path:pathname,
            });

            router.push("/")
        }

    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
            <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="mt-10 flex flex-col  w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={15} placeholder="Enter Thread Content" className="account-form_input no-focus" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-primary-500">
            Post Thread 
        </Button>

            </form>
        </Form>
    )
}

export default PostThread;