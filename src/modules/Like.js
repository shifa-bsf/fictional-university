import axios from "axios";

class Like {
  constructor() {
    axios.defaults.headers.common["X-WP-Nonce"] = universityData.nonce ;
    this.events()
  }

  events() {
    document.querySelector(".like-box").addEventListener("click", (e) => this.likeDispatcher(e))
  }

  likeDispatcher(e) {
    var currentLikeBox = e.target.closest(".like-box");

    if (currentLikeBox.getAttribute("data-exists") == "yes") {
      this.deleteLike(currentLikeBox)
    } else {
      this.createLike(currentLikeBox)
    }
  }

  async createLike(e) {
    var data = {
      'professorId': e.getAttribute("data-professor"),
    }

    try{
      const response = await axios.post(universityData.root_url+ "/wp-json/university/v1/likes/",data);
      console.log(response)
      e.setAttribute("data-exists", "yes");  
      var likeCount = parseInt(e.querySelector(".like-count").innerHTML, 10);
      likeCount++;
      e.querySelector(".like-count").innerHTML = likeCount;
      e.setAttribute("data-like", response.data);
    }
    catch(e){
      console.error(e);
    }
  }

  async deleteLike(e) {
    try {
      const response = await axios({
        url: universityData.root_url+ "/wp-json/university/v1/likes/",
        method: 'delete',
        data: { "like": e.getAttribute("data-like") },
      })
      e.setAttribute("data-exists", "no")
      var likeCount = parseInt(e.querySelector(".like-count").innerHTML, 10)
      likeCount--
      e.querySelector(".like-count").innerHTML = likeCount
      e.setAttribute("data-like", "")
      console.log(response.data)
    } catch (e) {
      console.log(e)
    }
  }
}

export default Like
