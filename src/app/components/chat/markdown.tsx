import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "../general/button";

// Product Card Component
const ProductCard = ({ product }: { product: any }) => {
  return (
    <div className="border border-gray-300 dark:border-gray-600 p-4 rounded-lg shadow-md w-[80dvw] md:max-w-[30vw] bg-[var(--dialog-bg)]">
      <div className="flex flex-row justify-between items-center">
      <h3 className="text-xl font-semibold">{product.brand}</h3>
      <Button variant="outline" onClick={() => {}}>View</Button>
      </div>
      <p className="text-gray-600 dark:text-gray-400">Price: {product.price}</p>
      <p className="text-gray-600 dark:text-gray-400">Stock: {product.available}</p>
      <p className="text-gray-600 dark:text-gray-400">Sizes: {product.size.join(", ")}</p>
    </div>
  );
};

const parseProductData = (data: string) => {
  try {
    // Extract the JSON part after "load_product:"
    const jsonString = data.replace(/^load_product:/, '').trim();

    // Replace single quotes with double quotes to form a valid JSON string
    const fixedJsonString = jsonString
      .replace(/'/g, '"') // Replace all single quotes with double quotes
      .replace(/"(\w+)"\s*:/g, '"$1":') // Ensure property names are properly quoted

    return JSON.parse(fixedJsonString); // Parse into an object
  } catch (error) {
    console.error("Error parsing product data:", error);
    return null;
  }
};


const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  if (children.includes("load_product:")) {
    try {
      const productData = parseProductData(children);
      console.log(productData);

      // Display the special ProductCard component
      return <ProductCard product={productData} />;
    } catch (error) {
      console.error("Error parsing product data:", error);
      return <p className="text-red-500">I got an error in loading the product</p>;
    }
  }
  
  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <pre
          {...props}
          className={`${className} text-sm w-[80dvw] md:max-w-[500px] overflow-x-scroll bg-zinc-100 p-3 rounded-lg mt-2 dark:bg-zinc-800`}
        >
          <code className={match[1]}>{children}</code>
        </pre>
      ) : (
        <code
          className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md`}
          {...props}
        >
          {children}
        </code>
      );
    },
    ol: ({ node, children, ...props }: any) => {
      return (
        <ol className="list-decimal list-outside ml-4" {...props}>
          {children}
        </ol>
      );
    },
    li: ({ node, children, ...props }: any) => {
      return (
        <li className="py-1" {...props}>
          {children}
        </li>
      );
    },
    ul: ({ node, children, ...props }: any) => {
      return (
        <ul className="list-decimal list-outside ml-4" {...props}>
          {children}
        </ul>
      );
    },
    strong: ({ node, children, ...props }: any) => {
      return (
        <span className="font-semibold" {...props}>
          {children}
        </span>
      );
    },
    a: ({ node, children, ...props }: any) => {
      return (
        <a
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    },
    h1: ({ node, children, ...props }: any) => {
      return (
        <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ node, children, ...props }: any) => {
      return (
        <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ node, children, ...props }: any) => {
      return (
        <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
          {children}
        </h3>
      );
    },
    h4: ({ node, children, ...props }: any) => {
      return (
        <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
          {children}
        </h4>
      );
    },
    h5: ({ node, children, ...props }: any) => {
      return (
        <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
          {children}
        </h5>
      );
    },
    h6: ({ node, children, ...props }: any) => {
      return (
        <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
          {children}
        </h6>
      );
    },
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
