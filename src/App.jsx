import { useState } from 'react'
import './App.css'

function App() {
  const [searchTerm, setSearchTerms] = useState("");
  const [fetchedAt, setFetchedAt] = useState(new Date().toISOString());
  const [searchResponse, setSearchResponse] = useState([]);
  const [historyTerms, setHistoryTerms] = useState([]);

  const saveTermAtHistory = (term) => {
      const termOnHistory = [...historyTerms]?.find((h) => h.term === term);

      if (termOnHistory) {
        termOnHistory.date = new Date().toISOString();

        const historyTermsWithoutTerm = [...historyTerms].filter((h) => h.term !== term);
        const updatedHistoryTerms = [...historyTermsWithoutTerm, termOnHistory];

        setHistoryTerms(updatedHistoryTerms);
        return;
      }

      setHistoryTerms([...historyTerms, { term, date: new Date().toISOString() }])
  };

  const getSearchResponses = (termsResults, linksResults) => {
    const searchResponses = termsResults.map((termResult, i) => {
      return {
        term: termResult,
        link: linksResults[i],
        date: new Date().toISOString()
      };
    });

    return searchResponses;
  };

  const fetchData = () => {
    const urlSearch =
      "https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=" +
      searchTerm;

    fetch(urlSearch, { mode: "cors" })
      .then((response) => response.json())
      .then((response) => {
        const searchResponses = getSearchResponses(response[1], response[3]);

        setSearchResponse(searchResponses);
        setFetchedAt(new Date().toISOString());
        saveTermAtHistory(searchTerm);
      });
  };

  return (
    <>
      <h1>Elastic wikipedia links view hiring test</h1>
      <section className="search">
        <input
          type="text"
          placeholder="Search on wikipedia…"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerms(e.target.value);
          }}
        />
        <button onClick={() => fetchData()}>Search</button>
      </section>
      <section className='results'>
        {searchResponse.length > 0 && <h3>Your Wikipedia links (fetched at {fetchedAt}):</h3>}
        {searchResponse.length === 0 && historyTerms.length > 0 && <p>No results found for this search term...</p>}
        <ul>
          {searchResponse?.map((str) => (
            <li key={str?.term}>
              <a href={str?.link} >
                {str?.term} <br />
              </a>
            </li>
          ))}
        </ul>
        {historyTerms.length > 0 && <h3>Previous search terms:</h3>}
        {historyTerms && historyTerms.length > 0 && (
          <ul>
            {historyTerms?.map((h) => (
              <li key={h?.term}>
                 {h?.term} {h?.date} <br />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

export default App
