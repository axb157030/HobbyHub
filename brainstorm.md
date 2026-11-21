
- **App** is the coordinator. It decides which view is showing, keeps shared settings such as theme and feed display mode, and connects components to Supabase.

- **FarmHeader** shows the app name and top-level controls. ThemeToggle switches between light and dark mode and navbar with home icon at left and links and toggle icon at very right
    - Look at https://tania.dev/redesign-version-7/ for light and dark theme
- **FarmNav** part of FarmHeader that shows links to Farm feed and adding a farm. 
    - Simple ul list of links. Maybe should get removed.

- **FeedControls** holds feed-wide controls: search by title, sort by newest or most upvoted, and choose compact or expanded posts.
    - Shows the search, sort, and filter controls and reports changes through props.
    - Always available on the feed: keep it inside FarmFeed, above the posts. Make it sticky if you want it to stay visible while scrolling.
    - Add the search bar: searching posts by creation time
    upvotes count, and "flag" in both ascending and descending order but default is descending order by creation date. feature in your README, so it’s part of the project checklist, not just an extra.

- **FarmFeed** receives a list of posts and displays them. It shouldn’t decide how to fetch them. Users can sort by creation date and upvote count as well as filter by post title and flag like "Question" or "Opinion".

    - Should render <FeedControls />, but they should have separate jobs
    - FarmFeed receives posts, applies those choices, and displays the matching posts.
        A parent page or route fetches the posts and passes them to FarmFeed.
        So FarmFeed can decide how to display the posts, but not how to fetch them.



- **AddFarmForum** Adds a post. `Users can set flags such as "Question" or "Opinion" while creating a post`. User does not add the author. Supabase anonymous sign-in assigns a persistent browser identity in the background; no password or author-ID prompt is required. Users must add the title. It is mandatory. Form will not submit without the post title. Users can add a flag that from a list of predetermined options, provide a video link. Upvotes are 0 upon addition. Users cannot change upvote number. Users cannot add comments. Creation Date is made automatically.

- **EditFarmForum** Edits a post. Similar to **AddFarmForum** component but creation date is not changed. Update date is changed though. Upvote will not necessarily be 0 and users cannot modify that. Users can edit only posts made by their browser identity, enforced by Supabase RLS. Go to it when going to see details of farm forum. This field allowing users to edit and delete forums is available in FarmForumDetails. Also updated_at post column will be updated with most current date. Clearing browser storage loses access to that identity's posts.

-

- **FarmForumCard** displays one's post's creation time, title, upvotes count.

- **FarmForumDetails** shows one complete post and its comments. If it’s a repost, it includes - RepostPreview, which displays and links to the original post. Users can increment and decrement the upvote by one and only one. One upvote, one author. User can add N comments to a post and delete only their comments. Also updated_at comment column will be updated with most current date when user edits their comments. There is a delete and edit button allowing users to delete and edit their own forums. Users can a video and 

- **FarmForumForm** handles creating, editing, and adding a post. It can also create a repost, but a repost is a new post with a reference to the original; it doesn’t modify the original. Has a flag that pass to it indicating where users can add a forum or not. Repost creation includes a field to give the original post ID. No author ID field is needed; Supabase anonymous auth and RLS determine whether the current browser identity can edit or delete the post. Should users be able to change repost id anywhere when editing the post?

- **CommentSection** displays comments; CommentForm adds one. Keep comment deletion available only to its author, and enforce that in Supabase RLS too.


```
App
├── FarmHeader
│   ├── FarmNav
│   └── ThemeToggle
└── Main
    ├── FarmFeed
    │   ├── FeedControls
    │   └── FarmForumCard list
    ├── FarmForumDetails
    |  |__ EditFarmForum
    |     |
    |       |__ FarmForumForm
    |
    |__ AddFarmForum
        |
        |__FarmForumForm
  
```