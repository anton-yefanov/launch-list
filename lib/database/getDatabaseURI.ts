export const getDatabaseURI = () => {
  const baseURI =
    "mongodb+srv://antonyefanov:9E9f3a4Antongogi@cluster0.xd3no.mongodb.net";
  const dbName = process.env.NODE_ENV === "production" ? "prod" : "test";

  return `${baseURI}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;
};
