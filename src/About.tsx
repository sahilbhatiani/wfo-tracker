import { useState, useRef } from 'react';
import { MyButton } from './common';

function About() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef<HTMLDialogElement>(null);

    const openModal = () => {
        setIsModalOpen(true);
        if (modalRef.current) {
            modalRef.current.showModal();
        } else {
            console.error("Modal dialog element not found.");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        if (modalRef.current) {
            modalRef.current.close();
        }
    };

    return (
        <div>
            <MyButton color='slate' onClick={openModal}>About</MyButton>
            <dialog
                id="my_modal_5"
                className="modal"
                ref={modalRef}
            >
                <div className="modal-box bg-slate-100 border-slate-700 shadow-2xl text-black border-2">
                    <h3 className="font-bold text-lg pb-1 text-black">WELCOME TO WFO!🎉</h3>
                    <p className="text-sm ">I've created this tool to help you reach your 50% work from office target with ease!</p>
                    <h3 className="font-bold text-lg pt-3 pb-1">HOW TO USE 📋</h3>
                    <p className="text-sm"><span className='font-bold text-green-600'>Left click</span> to mark 'Days in Office'</p>
                    <p className='text-sm'><span className='font-bold text-slate-600'>Right click</span> to mark 'Public holidays + Leave'</p>
                    <p className='text-sm'><span className='font-bold text-red-600'>Click Save</span> to save your data!</p>
                    <p className='text-sm pt-1'>The <span className='font-bold text-purple-600'>Statistics Box</span> will calculate how many days you need to come into the office and what percentage you are currently at</p>
                    <p className='text-sm italic'>Note: It adjusts for the number of leaves + holidays when calculating the target number of days to come in</p>
                    <h3 className="font-bold text-lg pt-3 pb-1 ">GET IN TOUCH 📞</h3>
                    <p className="text-sm">If you have any issues or feedback, shoot me an email on <span className="font-semibold text-blue-600">wfoquery@gmail.com</span></p>
                    <h3 className="font-bold text-lg pt-3 pb-1">TECH 💻🤖</h3>
                    <p className="text-sm ">You can find the code for this tool <a className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href='https://github.com/sahilbhatiani/wfo-tracker'>here</a>. The tool uses Vite (React + Typescript) and Tailwind CSS for the frontend and Google's Firebase on the backend for auth and database.    Feel free to make contributions to the github repository. Its open source! 😁</p>
                    <div className="modal-action flex justify-center">
                        <MyButton color='slate' onClick={closeModal}>Close</MyButton>
                    </div>
                </div>
            </dialog>
        </div>
    );
}

export default About;
