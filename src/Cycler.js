const user = {
  data: {
    pages: ["TopPageID", "NestSec2ID"],

    TopPageID: {
      name: "TopPageName",
      pages: ["FirstSubID", "SecSubID", "ThirdSubID"],
      data: {}
    },

    FirstSubID: {
      name: "FirstSub",
      pages: [],
      data: {}
    },
    SecSubID: {
      name: "SecSub",
      pages: ["NestSec1ID", "NestSec2ID"],
      data: {}
    },
    NestSec1ID: {
      name: "NestSec1",
      pages: [],
      data: {}
    },
    NestSec2ID: {
      name: "NestSec2",
      pages: ["Arm1", "Bein2"],
      data: {}
    },
    Arm1: {
      name: "Arm",
      pages: [],
      data: {}
    },
    Bein2: {
      name: "Bein",
      pages: [],
      data: {}
    },
    ThirdSubID: {
      name: "ThirdSub",
      pages: [],
      data: {}
    }
  }
}


const getSubPages = (pageID) => {
  const nestedPages = user.data[pageID].pages
  if (nestedPages.length > 0) {
    let childArray = []
    for (const childID of nestedPages) {
      childArray = [...childArray, ...getSubPages(childID)]
    }
    return [pageID, ...childArray]

  }else {
    return [pageID]
  }
}

const allPages = getSubPages("TopPageID")
// const allPages = getSubPages(user.data.pages)
console.log('allPages :>> ', allPages);