"use client";
import { useLocale } from '@/contexts/LocaleContext';
import { FaInstagram, FaMapMarkerAlt } from 'react-icons/fa';

export function Footer() {
    const { translate } = useLocale();
    return (
        <footer className="border-t border-border/40 bg-brown-800 py-6">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-brown-300 max-w-7xl">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center border border-brown-600 rounded-lg p-4 bg-brown-900 shadow-md">
                    {/* النصوص */}
                    <div className="text-center md:text-left space-y-1">
                        <p className="font-body text-lg font-semibold">
                            &copy; {new Date().getFullYear()} {translate('مطعم كرسبر. جميع الحقوق محفوظة.', 'Crispr Restaurant. All rights reserved.')}
                        </p>
                        <p className="font-body text-md text-brown-400">
                            {translate('تصميم وتطوير abdullahbalfaqih0@gmail.com', 'Designed and developed by abdullahbalfaqih0@gmail.com')}
                        </p>
                    </div>

                    {/* روابط التواصل */}
                    <div className="mt-4 md:mt-0 flex justify-center md:justify-end items-center space-x-6">
                        <a
                            href="https://www.instagram.com/crispr_r2"
                            className="flex items-center text-brown-400 hover:text-brown-200 transition-colors duration-200"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaInstagram className="mr-2 text-xl" />
                            <span>تابعونا على إنستغرام</span>
                        </a>

                        <a
                            href="https://www.google.com/maps/dir//WQHR%2B7GJ,+Seiyun,+Yemen/@15.9277118,48.7089013,30102m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x3de6a1006fe88d8b:0x6f22c75207112f1b!2m2!1d48.7913027!2d15.927729?entry=ttu&g_ep=EgoyMDI1MDYxMS4wIKXMDSoASAFQAw%3D%3D"
                            className="flex items-center text-brown-400 hover:text-brown-200 transition-colors duration-200"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaMapMarkerAlt className="mr-2 text-xl" />
                            <span>خريطة الموقع</span>
                        </a>
                    </div>
                </div>

                {/* خريطة جوجل */}
                <div className="mt-6 border border-brown-600 rounded-lg overflow-hidden shadow-inner">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3794.8022731768027!2d48.7089013!3d15.9277118!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3de6a1006fe88d8b%3A0x6f22c75207112f1b!2z2KfZhiDZhNin2KfZiiDYp9mE2KfZhNin2YQg2KfZhNin2Kcg2KfZhNin2KfYt9i52K7Yt9mE2KfYq9mI2KfZiiDYp9mE2KfZhNin2YQg2KfZhNin2Kcg2KfZhiDZhNin2KfZhNin2YUg!5e0!3m2!1sen!2sus!4v1618916890123!5m2!1sen!2sus"
                        width="100%"
                        height="250"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="موقع مطعم كرسبر"
                    ></iframe>
                </div>

            </div>
        </footer>
    );
}
