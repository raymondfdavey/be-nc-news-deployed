exports.formatDates = list => {
  const newArr = [];
  if (list.length === 0) return newArr;
  else
    list.forEach(item => {
      const newObj = { ...item };
      const date = new Date(item.created_at);
      newObj.created_at = date;
      newArr.push(newObj);
    });
  return newArr;
};

exports.makeRefObj = list => {
  if (list.length === 0) return [];
  const newObj = {};
  list.forEach(item => {
    const { article_id } = item;
    newObj[article_id] = item.title;
    return newObj;
  });

  return newObj;
};

exports.formatComments = (comments, refObj) => {
  if (comments.length === 0) return [];
  const newComments = comments.map(comment => {
    const newObj = { ...comment };
    for (let key in refObj) {
      if (refObj[key] === newObj.belongs_to) {
        newObj.article_id = +key;
      }
    }
    newObj.author = comment.created_by;
    delete newObj.created_by;
    delete newObj.belongs_to;
    newObj.created_at = new Date(comment.created_at);
    return newObj;
  });
  return newComments;
};
