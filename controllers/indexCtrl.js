
const renderPage = (path, title) => (req, res) => {
    res.render(path, { title });
  };
  
  exports.homePage = renderPage("pages/index", "holla");