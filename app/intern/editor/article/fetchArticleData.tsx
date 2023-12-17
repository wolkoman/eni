"use server"

import {Cockpit} from "../../../../util/cockpit";

export async function fetchArticleData(articleId: any) {
  const article = (await Cockpit.collectionGet('paper_articles', {filter: {_id: articleId}})).entries[0];
  const project = (await Cockpit.collectionGet('paper_projects', {filter: {_id: article.project._id}})).entries[0];
  const versions = (await Cockpit.collectionGet('paper_texts', {
    filter: {article: articleId},
    sort: {_created: -1}
  })).entries;
  return {article, project, versions};
}