const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrance",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsContainer = document.querySelector(".cards__list");

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

const postNewBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = document.forms["new-post-form"];
const newPostLinkInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionInput = newPostModal.querySelector("#card-caption-input");

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

  cardLikeBtn.addEventListener("click", (evt) => {
    evt.target.classList.toggle("card__like-btn_clicked");
  });

  cardTitle.textContent = data.name;

  cardDelBtn.setAttribute("aria-label", "Delete Post Button");
  cardDelBtn.setAttribute("type", "button");
  cardDelBtn.addEventListener("click", () => {
    cardElement.remove();
    cardElement = null;
  });

  cardImage.addEventListener("click", () => {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
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

function disableBtn(formElement) {
  const saveBtn = formElement.querySelector(".modal__save-btn");
  saveBtn.classList.add("modal__save-btn_inactive");
  saveBtn.disabled = true;
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
  resetValidation(
    newPostForm,
    [newPostCaptionInput, newPostLinkInput],
    settings
  );
  openModal(newPostModal);
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  closeModal(editProfileModal);
}

editProfileForm.addEventListener("submit", handleProfileFormSubmit);

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  // Test Link: https://images.unsplash.com/photo-1556079337-a837a2d11f04?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym9zdG9ufGVufDB8fDB8fHww
  // Test Name: Boston
  const newPost = {
    name: newPostCaptionInput.value,
    link: newPostLinkInput.value,
  };
  cardsContainer.prepend(getCardElement(newPost));
  disableBtn(newPostForm);
  closeModal(newPostModal);
  evt.target.reset();
}

newPostForm.addEventListener("submit", handleAddCardSubmit);

initialCards.forEach(function (item) {
  cardsContainer.append(getCardElement(item));
});

modalList.forEach((modalElement) => {
  modalElement.addEventListener("click", (evt) => {
    closeModal(evt.target);
  });
});
