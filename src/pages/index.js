import "./index.css";

import Api from "../utils/Api.js";
import {
  settings,
  resetValidation,
  enableValidation,
  disableBtn,
} from "../scripts/validation.js";
import { setButtonText, handleSubmit } from "../utils/helpers.js";

// const initialCards = [
//   {
//     name: "Golden Gate Bridge",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrance",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "406384d0-720a-458a-b2e9-9751f7221941",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, users]) => {
    cards.forEach((card) => {
      renderCard(card, "append");
    });
    profileNameEl.textContent = users.name;
    profileDescriptionEl.textContent = users.about;
    profileAvatarEl.src = users.avatar;
  })
  .catch((err) => {
    console.error(err);
  });

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsContainer = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

const closeButtons = document.querySelectorAll(".modal__close-btn");

const modalList = document.querySelectorAll(".modal");

const profileEditBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = document.forms["edit-profile-form"];
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");
const avatarEditBtn = document.querySelector(".profile__avatar-btn");
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarForm = document.forms["edit-avatar-form"];
const editAvatarLinkInput = editAvatarModal.querySelector(
  "#profile-avatar-input"
);

const postNewBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = document.forms["new-post-form"];
const postSaveBtn = newPostForm.querySelector(".modal__save-btn");
const newPostLinkInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionInput = newPostModal.querySelector("#card-caption-input");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = document.forms["delete-form"];
const deleteCancelBtn = deleteForm.querySelector(
  ".modal__save-btn_type_cancel"
);

const previewModal = document.querySelector("#preview-modal");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");

function getCardElement(data) {
  let cardElement = cardTemplate.cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDelBtn = cardElement.querySelector(".card__del-btn");

  cardImage.src = data.link;
  cardImage.alt = data.name;

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_clicked");
  }

  cardLikeBtn.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });

  cardTitle.textContent = data.name;

  cardDelBtn.setAttribute("aria-label", "Delete Post Button");
  cardDelBtn.setAttribute("type", "button");
  cardDelBtn.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
  });

  cardImage.addEventListener("click", () => {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleLike(evt, cardId) {
  const isLiked = evt.target.classList.contains("card__like-btn_clicked")
    ? true
    : false;
  console.log(isLiked);
  api
    .changeLikeStatus(cardId, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-btn_clicked");
    })
    .catch((err) => {
      console.error(err);
    });
}

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);

  cardsContainer[method](cardElement);
}

function escClose(evt) {
  if (evt.key === "Escape") {
    modalList.forEach((modalElement) => {
      if (modalElement.classList.contains("modal_is-opened")) {
        closeModal(modalElement);
      }
    });
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", escClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", escClose);
}

closeButtons.forEach((button) => {
  const modal = button.closest(".modal");

  button.addEventListener("click", () => closeModal(modal));
});

profileEditBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings
  );
  openModal(editProfileModal);
});

postNewBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

avatarEditBtn.addEventListener("click", () => {
  openModal(editAvatarModal);
});

deleteCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

function handleProfileFormSubmit(evt) {
  function makeRequest() {
    return api
      .editUserInfo({
        name: editProfileNameInput.value,
        about: editProfileDescriptionInput.value,
      })
      .then((data) => {
        profileNameEl.textContent = data.name;
        profileDescriptionEl.textContent = data.about;
        closeModal(editProfileModal);
      });
  }
  handleSubmit(makeRequest, evt);
}

function handleAvatarFormSubmit(evt) {
  function makeRequest() {
    return api
      .updateUserAvatar({
        avatar: editAvatarLinkInput.value,
      })
      .then((data) => {
        profileAvatarEl.src = data.avatar;
        closeModal(editAvatarModal);
      });
  }
  handleSubmit(makeRequest, evt);
}

function handleDeleteSubmit(evt) {
  function makeRequest() {
    return api.deleteCard(selectedCardId).then(() => {
      selectedCard.remove();
      selectedCard = null;
      closeModal(deleteModal);
    });
  }
  handleSubmit(makeRequest, evt, "Deleting...");
}

editProfileForm.addEventListener("submit", handleProfileFormSubmit);
editAvatarForm.addEventListener("submit", handleAvatarFormSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

function handleAddCardSubmit(evt) {
  // Test Link: https://images.unsplash.com/photo-1556079337-a837a2d11f04?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym9zdG9ufGVufDB8fDB8fHww
  // Test Name: Boston
  function makeRequest() {
    return api
      .addCard({
        name: newPostCaptionInput.value,
        link: newPostLinkInput.value,
      })
      .then((data) => {
        renderCard(data, "prepend");
        disableBtn(postSaveBtn, settings);
        closeModal(newPostModal);
      });
  }
  handleSubmit(makeRequest, evt);
}

newPostForm.addEventListener("submit", handleAddCardSubmit);

modalList.forEach((modalElement) => {
  modalElement.addEventListener("click", (evt) => {
    if (evt.target === evt.currentTarget) {
      closeModal(evt.target);
    }
  });
});

enableValidation(settings);
