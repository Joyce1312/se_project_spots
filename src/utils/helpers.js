function setButtonText(
  submitBtn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    submitBtn.textContent = loadingText;
  } else {
    submitBtn.textContent = defaultText;
  }
}

function handleSubmit(request, evt, loadingText = "Saving...") {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  const defaultText = submitBtn.textContent;
  setButtonText(submitBtn, true, defaultText, loadingText);

  request()
    .then(() => {
      evt.target.reset();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(submitBtn, false, defaultText, loadingText);
    });
}

export { setButtonText, handleSubmit };
