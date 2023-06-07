import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "./Table.css";

/**
 * Creates a custom table based on the content provided.
 * @component
 * @param {Array} content - The original content of the table – each row is symbolized by an object in the array.
 * @param {String} color - The main color, passed in hex format. The rest of the theme is calculated from it. If not specified, the main color is a medium warm grey.
 * @param {String} dateFormat - The format dates must be displayed in, if there are any in the content. The string must be a viable dayjs format (i.e. "MM/DD/YYYY"). If not specified, the dates are rendered in DD/MM/YYYY.
 * @param {Object} objectKey - The keys for the values that must be displayed if there are any objects within a row object. For example, if a row contains an property "animals", with as value an object { pastFavorite: "unicorn", currentFavorite: "panda" }, you must pass { animals: "pastFavorite" } to display "unicorn", and the value of the past favorite for any other row. If there are no sub-objects in your content, this does not need to be specified.
*/
export function Table({ content, color, dateFormat, objectKey }) {
    const [formattedContent, setFormattedContent] = useState(null);
    const [filteredContent, setFilteredContent] = useState(null);
    const [separatedContent, setSeparatedContent] = useState(null);
    const [categories, setCategories] = useState([]);
    const [sorting, setSorting] = useState({});
    const [rowsDisplayed, setRowsDisplayed] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [colorTheme, setColorTheme] = useState({
        "--bright": "rgba(139, 134, 128, 1)",
        "--light": "rgba(139, 134, 128, 0.2)",
        "--text": "white"
    });

    useEffect(() => {
        /**
         * Defines all categories that exist in the content, to render all columns.
         * @function
         * @param {Array} content - The original content.
        */
        const defineCategories = (content) => {
            const tempCategories = [];
            const formattedCategories = [];
            const initSorting = {};

            content.forEach(object => {
                for (let property in object) {
                    if(!tempCategories.includes(property)) {
                        tempCategories.push(property);
                    }
                }
            });

            tempCategories.forEach(category => {
                let formattedCategory = category;
                for (const letter of category) {
                    if (letter === letter.toUpperCase()) {
                        formattedCategory = category.replace(letter, ` ${letter.toLowerCase()}`);
                    }
                }
                formattedCategory = formattedCategory.replace(formattedCategory[0], formattedCategory[0].toUpperCase());
                formattedCategories.push({ "category": category, "formattedCategory": formattedCategory });
                initSorting[category] = "none";
            });

            setCategories(formattedCategories);
            setSorting(initSorting);
        };

        /**
         * Removes sub-objects from every row of the content according to the object key, if there are any.
         * @function
         * @param {Array} content - The original content.
        */
        const removeObjects = (content) => {
            let tempContent = [];

            content.forEach(object => {
                const newObject = {};
                for(const property in object) {
                    if(objectKey.hasOwnProperty(property)) {
                        const replacementProperty = objectKey[property];
                        newObject[property] = object[property][replacementProperty];
                    } else {
                        newObject[property] = object[property];
                    }
                }
                tempContent.push(newObject);
            });
            setFormattedContent(tempContent);
        };

        defineCategories(content);
        removeObjects(content);
    }, [content, objectKey]);

    useEffect(() => {
        setFilteredContent(formattedContent);
    }, [formattedContent]);

    /**
     * Creates a custom color theme based on the hex code passed in props.
     * @function
     * @param {String} hex - The hex code of the main color.
    */
    const customColorTheme = (hex) => {
        let newHex = hex;
        let text;

        if(newHex.length === 4) {
            for (const letter of newHex) {
                if(letter !== "#") {
                    newHex = newHex.replace(letter, `${letter}${letter}`);
                }
            }
        }
        const r = parseInt(newHex.slice(1, 3), 16);
        const g = parseInt(newHex.slice(3, 5), 16);
        const b = parseInt(newHex.slice(5, 7), 16);
        const bright = `rgba(${r}, ${g}, ${b}, 1)`;
        const light = `rgba(${r}, ${g}, ${b}, 0.2)`;

        const relativeLuminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        if(relativeLuminance > 0.5) {
            text = "black";
        } else {
            text = "white";
        }

        setColorTheme({
            "--bright": bright,
            "--light": light,
            "--text": text
        });
    };

    useEffect(() => {
        const hexRegex = /^#[0-9a-zA-Z]{3}(?:[0-9a-zA-Z]{3})?$/;
        if(hexRegex.test(color)) {
            customColorTheme(color);
        }
    }, [color]);

    /**
     * Sorts the content based on a category.
     * @function
     * @param {Array} content - The formatted content of the table.
     * @param {String} category - The category the content is sorted by.
     * @param {Boolean} toggleOrder - Indicates whether the sorting order of that category needs to be toggled after sorting.
    */
    const sortContent = (content, category, toggleOrder) => {
        return [...content].sort((a, b) => {
            if(((sorting[category] === "none" || sorting[category] === "descending") && toggleOrder) || (sorting[category] === "ascending" && !toggleOrder)) {
                return a[category].toLowerCase().localeCompare(b[category].toLowerCase());
            } else {
                return b[category].toLowerCase().localeCompare(a[category].toLowerCase());
            }
        });
    };

    /**
     * Switches the order of sorting between ascending and descending for a specific category.
     * @function
     * @param {String} category - The category that needs to be switched.
    */
    const toggleSortOrder = (category) => {
        const newSorting = {...sorting};
        for(let sortingCategory in newSorting) {
            newSorting[sortingCategory] = "none";
        }
        if(sorting[category] === "none" || sorting[category] === "descending") {
            newSorting[category] = "ascending";
        } else {
            newSorting[category] = "descending";
        }
        setSorting(newSorting);
    };

    /**
     * Filters the content based on a submitted query.
     * @function
     * @param {String} query - The query term, found from the search input.
     * @param {Array} content - The formatted content of the table.
    */
    const filterContent = (query, content) => {
        const newContent = content.filter(row => {
            let rowValues = Object.values(row);
            rowValues = rowValues.map(value => value.toLowerCase().includes(query.toLowerCase()));
            return rowValues.includes(true);
        });

        for(const category in sorting) {
            if(sorting[category] !== "none") {
                return sortContent(newContent, category, false);
            }
        }

        return newContent;
    };

    useEffect(() => {
        /**
         * Separates the filtered and sorted content into pages, based on the selected number of items to be displayed.
         * @function
         * @param {Array} content - The filtered and sorted content.
        */
        const separatePages = (content) => {
            let originalContent = [...content];
            let slices = [];
            while (originalContent.length > 0) {
                slices.push(originalContent.slice(0, rowsDisplayed));
                originalContent = originalContent.slice(rowsDisplayed - 1, -1);
            }
            setSeparatedContent(slices);
        };

        if(filteredContent) {
            setCurrentPage(0);
            separatePages(filteredContent);
        }
    }, [rowsDisplayed, filteredContent]);

    /**
     * Tests if a row has a value for a category, and if so renders the value accordingly (accounting for dates).
     * @function
     * @param {Object} row - A row of the content.
     * @param {String} category - The category being rendered.
    */
    const renderProperty = (row, category) => {
        if(row.hasOwnProperty(category.category)) {
            if(dayjs(row[category.category]).isValid() && row[category.category] === dayjs(row[category.category]).toISOString()) {
                if(dateFormat) {
                    return dayjs(row[category.category]).format(dateFormat);
                } else {
                    return dayjs(row[category.category]).format("DD/MM/YYYY");
                }
            }
            return row[category.category];
        }
    };

    return (
        <div className="table-container" style={colorTheme}>
            <header className="table-container-header">
                <label htmlFor="tableSeparate">
                    Show
                    <select
                        id="tableSeparate"
                        name="tableSeparate"
                        className="table-container-header-select"
                        value={rowsDisplayed}
                        onChange={event => setRowsDisplayed(event.target.value)}
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    entries
                </label>
                <form className="table-container-header-search">
                    <label htmlFor="tableSearch">Search: </label>
                    <input id="tableSearch" name="tableSearch" className="table-container-header-search-input" onChange={(event) => {
                        setFilteredContent(filterContent(event.target.value, formattedContent));
                    }}></input>
                </form>
            </header>
            <table className="table">
                <thead>
                    <tr className="table-header">
                        { categories.map(category =>
                            <th key={category.category} className="table-header-cell">
                                <button className="table-header-sort" onClick={() => {
                                    setFilteredContent(sortContent(filteredContent, category.category, true));
                                    toggleSortOrder(category.category);
                                }}>
                                    <h2>{category.formattedCategory}</h2>
                                    <div className="table-header-sort-icon-box">
                                        <i className={ sorting[category.category] !== "descending" ? "table-header-sort-icon fa-solid fa-sort-up" : "table-header-sort-icon fa-solid fa-sort-up  table-header-sort-icon-hidden" }></i>
                                        <i className={ sorting[category.category] !== "ascending" ? "table-header-sort-icon fa-solid fa-sort-down" : "table-header-sort-icon fa-solid fa-sort-down  table-header-sort-icon-hidden" }></i>
                                    </div>
                                </button>
                            </th>)
                        }
                    </tr>
                </thead>
                <tbody>
                    { (separatedContent && separatedContent.length > 0) ?
                        separatedContent[currentPage].map(row => (
                            <tr key={separatedContent[currentPage].indexOf(row)} className="table-row">
                                { categories.map(category =>
                                    <td key={category.category} className="table-row-cell">{ renderProperty(row, category) }</td>
                                )}
                            </tr>))
                        : <tr>
                            <td className="table-error" colSpan={categories.length}>No result matches your search!</td>
                        </tr>
                    }
                </tbody>
            </table>
            <footer className="table-footer">
                { (separatedContent && separatedContent.length > 0) &&
                    <p className="table-footer-counter">
                        Showing {(filteredContent.indexOf(separatedContent[currentPage][0])) + 1} to { filteredContent.indexOf(separatedContent[currentPage][rowsDisplayed - 1]) === -1 ? filteredContent.length : (filteredContent.indexOf(separatedContent[currentPage][rowsDisplayed - 1])) + 1 } of {filteredContent.length} entries
                    </p>
                }
                { (separatedContent && separatedContent.length > 0) &&
                    <nav className="table-footer-nav">
                        { currentPage !== 0 && <button onClick={() => setCurrentPage(currentPage - 1)} className="table-footer-nav-button">Previous</button> }
                        <p className="table-footer-nav-counter">Page {currentPage + 1}</p>
                        { (separatedContent && currentPage !== separatedContent.length - 1) && <button onClick={() => setCurrentPage(currentPage + 1)} className="table-footer-nav-button">Next</button> }
                    </nav>
                }
            </footer>
        </div>
    );
}