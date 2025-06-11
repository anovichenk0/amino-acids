import { Toaster } from "sonner";
import AminoContext from "./components/AminoContext";
import AminoForm from "./components/AminoForm";
import AminoResult from "./components/AminoResult";
import { Finder, FinderProvider } from "./components/Finder";

function App() {
    return (
        <FinderProvider>
            <div className="container pt-40">
                <Finder />
                <h1 className="mb-10">Выравнивание аминокислот</h1>
                <AminoContext>
                    <AminoForm />
                    <div className="pt-10">
                        <AminoResult />
                    </div>
                </AminoContext>
                <Toaster />
            </div>
        </FinderProvider>
    );
}

export default App;
