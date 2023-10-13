import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Article } from '@/schema/article';
import SortableTable, { DataRow } from '../../components/table/SortableTable';
const DOMAIN = process.env.DOMAIN;
//props
export interface SearchProps {
  message: string;
  keywords: string[];
  filteredArticles: Article[];
}

//returns headersList, and sets format for values in the data rows
export const headersList: DataRow<Article>[] = [
  { key: 'title', label: 'Title' },
  {
    key: 'authors',
    label: 'Authors',
    displayAs: (authors: string[]) => authors.join('; '),
  },
  { key: 'date', label: 'Date' },
  { key: 'journal', label: 'Journal' },
  { key: 'volume', label: 'Volume' },
  { key: 'issue', label: 'Issue' },
  {
    key: 'pageRange',
    label: 'Page Range',
    displayAs: ([start, end]: [number, number]) => start + '-' + end,
  },
  { key: 'doi', label: 'DOI' },
  {
    key: 'keywords',
    label: 'Keywords',
    displayAs: (keywords: string[]) => keywords.join(', '),
  },
  { key: 'abstract', label: 'Abstract' },
];

//searches for articles containing the relevant keywords
export const searchKeywords = async (field: string, input: string) => {
  try {
    const response = await fetch(DOMAIN + `articles/filter?field=${field}&keywords=${input}`);
    const result: SearchProps = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const SearchDisplay = () => {
  //sets the inital value
  const [data, setData] = useState<SearchProps>({
    message: '',
    filteredArticles: [],
    keywords: [],
  });

  //retrieves searched query and updates the components with the search results
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const field = document.querySelector('select')?.value;
    const query = document.querySelector('input')?.value;
    if (!field || !query) return <p>gg</p>;
    const obj = await searchKeywords(field, query);
    if (!obj) return <p>error fetching</p>;
    setData(obj);
    (document.getElementById('result') as HTMLImageElement).hidden = false;
  };

  return (
    <div data-testid="container" className="container">
      <h2>Search for Keywords</h2>
      <form onSubmit={handleSubmit}>
        <input data-testid="searchInput" type="text" size={80} name="keywords" />
        <select name="field">
          <option value="all">Any Field</option>
          <option value="keywords">SE Methods</option>
        </select>
        <button data-testid="searchButton" type="submit" style={{ marginLeft: '2em' }}>
          search
        </button>
      </form>
      <div data-testid="result" id="result" hidden>
        <h3>Search Results for &quot;{data.keywords}&quot;</h3>
        {data.filteredArticles.length === 0 ? (
          'No Results'
        ) : (
          <SortableTable headers={headersList} data={data.filteredArticles} />
        )}
      </div>
    </div>
  );
};

export default SearchDisplay;