'use client'

type ProductProps = {
    name: string;
    price: number;
    image?: string;
    onaddtocart: () => void;
};

export default function ProductCard ({name , price, image , onaddtocart}: ProductProps){

    return(
        <div className="border p-4 rounded-md shadow bg-white hover:scale-105 ">
            {image && (
                <img
                src={image}
                alt={name}
                className="w-full h-40 object-cover rounded mb-2"
                />    
            )}
            <h2 className="text-black">{name}</h2>
            <p className="text-black">${price}</p>
            <button onClick={onaddtocart} className="bg-transparent hover:scale-110 px-4 py-2 rounded">
            <img src="/icons/add.png" alt="Add to Cart" className="w-8 h-8 mx-auto" />
            </button>

        </div>

    );


}



