import { Instagram } from "lucide-react";
import Image from "next/image";
import { InstagramPost } from "@/lib/instagram";

export default function InstagramFeed({ posts = [] }: { posts?: InstagramPost[] }) {

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <a
            href="https://www.instagram.com/veloriavault/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-3 mb-4 group"
          >
            <Instagram className="w-6 h-6 text-[#b59a5c] group-hover:scale-110 transition-transform" />
            <span className="text-lg font-medium text-gray-900">
              @veloriavault
            </span>
          </a>
          <p className="text-gray-500 text-sm">
            Follow us on Instagram for the latest updates and behind-the-scenes
          </p>
        </div>

        {/* Instagram Feed Grid */}
        <div 
          id="instagram-feed-container"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {posts.length > 0 ? (
            posts.map((post) => (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden bg-gray-100 block"
                title={post.caption}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.imageUrl}
                  alt={post.caption || "Veloria Vault Instagram Post"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
              </a>
            ))
          ) : (
             <div className="col-span-full min-h-[150px] flex items-center justify-center border-2 border-dashed border-gray-200 p-8 text-center">
               <p className="text-gray-500 text-sm">
                 Unable to load Instagram feed at this time. Follow us directly on Instagram!
               </p>
             </div>
          )}
        </div>

        {/* Follow Button */}
        <div className="text-center mt-8">
          <a
            href="https://www.instagram.com/veloriavault/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 border-2 border-black text-black text-xs font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all duration-300"
          >
            Follow Us
          </a>
        </div>
      </div>
    </section>
  );
}
