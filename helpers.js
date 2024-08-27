
import { getLike, getDislike, getPostsWithToken } from './api.js';
import { getToken, page, renderApp, setPage, setPosts } from './index.js';
import { updateLikeButton } from './components/posts-page-component.js';
import { POSTS_PAGE } from './routes.js';

export function saveUserToLocalStorage(user) {
  window.localStorage.setItem("user", JSON.stringify(user));
}

export function getUserFromLocalStorage(user) {
  try {
    return JSON.parse(window.localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
}

export function removeUserFromLocalStorage(user) {
  window.localStorage.removeItem("user");
}

export const sanitizeHTML = (htmlString) => {
  return htmlString
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
};

export function handleLike(postId, isLiked) {
  const token = getToken();
  if (isLiked) {
    return getDislike(postId, { token })
      .then((post) => {        
        const likeButton = document.querySelector(`[data-post-id="${postId}"]`);
        if (likeButton) {
          const likeImage = likeButton.querySelector('img');
          likeImage.src = './assets/images/like-not-active.svg'; 
          likeButton.dataset.liked = 'false'; 
        }
        return post;
      })
      .then(() => {
        return getPostsWithToken(); 
      })
      .then((newPosts) => {
        console.log(newPosts);
        setPosts(newPosts); 
        updateLikeButton(postId, true);
        setPage(POSTS_PAGE);
        renderApp();
      })
      .catch((error) => {
        console.error('Ошибка при дизлайке:', error);
        throw error; 
      });
  } else {
    return getLike(postId, { token })
      .then((post) => {        
        const likeButton = document.querySelector(`[data-post-id="${postId}"]`);
        if (likeButton) {
          const likeImage = likeButton.querySelector('img');
          likeImage.src = './assets/images/like-active.svg'; 
          likeButton.dataset.liked = 'true'; 
        }
        return post;
      })
      .then(() => {
        return getPostsWithToken(); 
      })
      .then((newPosts) => {
        console.log(newPosts);
        setPosts(newPosts); 
        updateLikeButton(postId, true);
        setPage(POSTS_PAGE);
        renderApp();
      })
      .catch((error) => {
        console.error('Ошибка при лайке:', error);
        throw error; 
      });
  }
}