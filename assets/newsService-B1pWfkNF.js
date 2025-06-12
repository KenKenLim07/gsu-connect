import{c as n}from"./index-_PUbFhXB.js";const r="https://fkyokvjruvgsritmazey.supabase.co",o="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZreW9rdmpydXZnc3JpdG1hemV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTMwNTc1MywiZXhwIjoyMDY0ODgxNzUzfQ.2s8Wpf_IjYG5OKL0w7BsPe6k5NIm2kYO6IH0MY8uLgE";let t=null;const i=(t||(t=n(r,o)),t);function u(a){const e=a;return{id:e.id,title:e.title,content:e.content,published_at:e.published_at,source_url:e.source_url,campus_id:e.campus_id,created_at:e.created_at,image_url:e.image_url||void 0,campus:e.campus?{id:e.campus.id,name:e.campus.name,location:e.campus.location,created_at:e.campus.created_at}:void 0}}async function p(){try{console.log("Fetching news from Supabase...");const{data:a,error:e,count:c}=await i.from("news").select(`
        *,
        campus:campus_id (
          id,
          name,
          location,
          created_at
        )
      `).order("published_at",{ascending:!1});if(e)return console.error("Error fetching news:",e),{data:[],error:e,count:0};console.log("Raw news data:",a);const s=a.map(u);return console.log("Mapped news items:",s),{data:s,error:null,count:c||0}}catch(a){return console.error("Unexpected error fetching news:",a),{data:[],error:a,count:0}}}export{p as g};
