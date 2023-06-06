
![NodeJS](https://img.shields.io/badge/-NodeJS-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=for-the-badge&logo=react&logoColor=black)
![CSS](https://img.shields.io/badge/-CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)

# Need a light, customizable and easy-to-use table component to display data in your React app? Look no further!

![Table screenshot](https://github.com/chloeadriancreates/custom-react-table/blob/main/screenshot.png?raw=true)

This 32kb component allows you to display complex data into a clean table, complete with pagination, a search system and sorting by each category. Let's see how it works!

## Getting started

### Installation
    npm install @chloeadriancreates/custom-react-table
   
### Usage
    import { Table } from "@chloeadriancreates/custom-react-table";
    
    const YourComponent = () => {
      const [content, setContent] = useState([{
	      animal: "manatee",
	      color: "turquoise"
	      food: "pizza"
      }, {
	      animal: "deer",
	      color: "lavender"
	      food: "sushi"
      }]);
      return <Table content={content} />;
    };

## Further customization
The only required prop for the table to run is `content`, which is an array of objects, as you can see in the demonstration in [Getting started](./#getting-started). There are, however, a few options for further customization.

### Colors
A color theme is calculated based on one main color, which is by default a medium warm grey. You can customize it to fit your app's design system, by passing a hex code (either 3 or 6 characters) to the `color` prop. For fonts, setting the `font-family` of the parent component you're using the table in suffices, as it uses `inherit`.

    <Table content={content} color="#577399" />
  
### Date format
The `Table` component automatically detects dates (passed as ISO strings), and formats them by default in "DD/MM/YYYY" using [dayjs](https://day.js.org/en/). You can use any other valid dayjs [parsing token](https://day.js.org/docs/en/parse/string-format) by passing it to the `dateFormat` prop.

    <Table content={content} dateFormat="MM/DD/YY" />
    
### Object flattening
If a row of your table (symbolized by each object in your content array) contains another object, you can choose to flatten it by choosing which property to display. For example, if a row were to look like this: 

    {
	    color: "purple",
    	animals": { 
    		pastFavorite: "unicorn", 
    		currentFavorite: "panda" 
    	}
    }

You would have to pass either `{ animals: "pastFavorite" }` or  `{ animals: "currentFavorite" }` to the `objectKey` prop, to decide whether to display "unicorn" or "panda". The `objectKey` object can have as many properties as your content has properties that are objects. However, this is as deep as it goes: further sub-objects will not work with this table.

    <Table content={content} objectKey={ animals: "pastFavorite" } />
    
## Future updates
These are things that may limit your usage of this component at the moment, but I am aware of and working on! Currently:
- Row objects can't contain arrays.
- The Table component only has a desktop version.

## Thanks for reading, and happy coding!  
Chloé Adrian