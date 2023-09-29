import React, { useState, FormEvent } from 'react';
import { QueuedArticle } from "../src/schema/queuedArticle";
import styles from './SubmissionForm.module.css';

const ArticleSubmissionForm = () => {
  const [formData, setFormData] = useState<QueuedArticle>({
    title: '',
    authors: [],
    date: '',
    journal: '',
    volume: 0,
    issue: 0,
    pageRange: [0, 0],
    doi: '',
    keywords: [],
    abstract: '',
    isModerated: Boolean(false),
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const saveArticle = async (formData: QueuedArticle) => {
    const requestOptions = {
      method: 'POST',
      headers: {
      },
      body: JSON.stringify(formData),
    };
    const res = await fetch('https://backend-kmj9warcq-janenotjung-hue.vercel.app/articles', requestOptions);
    return res;
  }
  // Define the POST request options

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const errorValidation: { [key: string]: string } = {};

    for (const field in formData) {
      const value = formData[field as keyof QueuedArticle];
      errorValidation[field] = '';
      if ((field !== 'isModerated' && !value) || ((
        field === 'pageRange' &&
        (formData.pageRange[0] === 0 || formData.pageRange[1] === 0)
      ) || (
          (field === 'authors' || field === 'keywords') &&
          formData[field].length === 0
        ))) {
        errorValidation[field] = `${field} must not be empty`;
        console.log(errorValidation, formData);
      }
    }

    if (isNaN(formData.volume)) {
      errorValidation.volume = 'Volume must be a number';
    }

    if (isNaN(formData.issue)) {
      errorValidation.issue = 'Issue must be a number';
    }

    if (!Array.isArray(formData.pageRange) || formData.pageRange.length !== 2) {
      errorValidation.pageRange = 'Page Range must be an array of two numbers';
    }

    if (Object.keys(errorValidation).length < 0) {
      setErrors(errorValidation);
      return;
    }
    console.log(formData)

    saveArticle(formData);
  }


  const handleForm = (e: React.FormEvent<HTMLInputElement>): void => {
    const index = e.currentTarget.dataset.index;
    const name = e.currentTarget.dataset.key as keyof QueuedArticle;
    const type = e.currentTarget.type;
    const rawValue = e.currentTarget.value;
    const value = type === 'number' ? parseInt(rawValue) : rawValue;
    const formKeys: Record<'single' | 'array', Array<keyof QueuedArticle>> = {
      single: ['title', 'date', 'journal', 'volume', 'issue', 'doi', 'abstract'],
      array: ['authors', 'keywords', 'pageRange'],
    };

    if (!name)
      throw `Form item ${name} has no name parameter!`;
    if (formKeys.single.includes(name)) {
      const newData = { [name]: value };
      setFormData({ ...formData, ...newData });
    } else if (formKeys.array.includes(name)) {
      if (!index)
        throw `Form item ${name} has no index parameter!`;
      const newArray = formData[name] as Array<string | number>;
      newArray[+index] = value;
      setFormData({ ...formData, [name]: newArray });
    }

  }

  // TODO change onChange to on deselect
  return (
    <form className={styles.Form} onSubmit={handleSubmit}>
      <div className={styles.FormContent}>
        <div className={styles.LeftColumn}>
          <label> Article Title:
            <input className={styles.Input} onChange={handleForm} type="text" data-key="title" />
            {errors.title && <p className={styles.Error}>{errors.title}</p>}
          </label>
          <br />
          <label> Author:
            <input className={styles.Input} onChange={handleForm} type="text" data-key="authors" data-index="0" />
            <button type="button">+</button>
            {errors.authors && <p className={styles.Error}>{errors.authors}</p>}
          </label>
          <br />
          <label> Keywords:
            <input className={styles.Input} onChange={handleForm} type="text" data-key="keywords" data-index="0" />
            {errors.keywords && <p className={styles.Error}>{errors.keywords}</p>}
          </label>
          <br />
          <label> Abstract:
            <input className={styles.Input} onChange={handleForm} type="text" data-key="abstract" />
            {errors.abstract && <p className={styles.Error}>{errors.abstract}</p>}
          </label>
        </div>
        <div className={styles.RightColumn}>
          <label> Journal:
            <input className={styles.Input} onChange={handleForm} type="text" data-key="journal" />
            {errors.journal && <p className={styles.Error}>{errors.journal}</p>}
          </label>
          <br />
          <div className={styles.RightColumnRow}>
            <label> Date:
              <input className={styles.Input} onChange={handleForm} type="date" data-key="date" />
              {errors.date && <p className={styles.Error}>{errors.date}</p>}
            </label>
            <br />
            <label> DOI:
              <input className={styles.Input} onChange={handleForm} type="text" data-key="doi" />
              {errors.doi && <p className={styles.Error}>{errors.doi}</p>}
            </label>
            <br />
          </div>
          <div className={styles.RightColumnRow}>
            <label> Volume:
              <input className={styles.Input} onChange={handleForm} type="number" data-key="volume" />
              {errors.volume && <p className={styles.Error}>{errors.volume}</p>}
            </label>
            <br />
            <label> Issue:
              <input className={styles.Input} onChange={handleForm} type="number" data-key="issue" />
              {errors.issue && <p className={styles.Error}>{errors.issue}</p>}
            </label>
            <br />
          </div>
          <div className={styles.RightColumnRow}>
            <label> Page Range:
              <input className={styles.Input} onChange={handleForm} type="number" data-key="pageRange" data-index="0" />
              <input className={styles.Input} onChange={handleForm} type="number" data-key="pageRange" data-index="1" />
              {errors.pageRange && <p className={styles.Error}>{errors.pageRange}</p>}
            </label>
          </div>
        </div>
      </div>
      <button disabled={formData === undefined ? true : false} type="submit">Submit</button>
    </form>
  )
}

export default ArticleSubmissionForm
