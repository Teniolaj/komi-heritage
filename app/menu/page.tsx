"use client";

import { PageWrapper } from "@/components/PageWrapper";
import { PrimaryButton, IconButton } from "@/components/ui/Button";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Plus, Minus, X, ArrowRight, ShoppingBag } from "lucide-react";

// Mock Data
const categories = ["All", "Kenkey Combos", "Street Sides", "Archive Drinks"];
const menuItems = [
  {
    id: 1,
    name: "Ga Kenkey Classic",
    price: 45.00,
    category: "Kenkey Combos",
    tag: "Heritage Recipe",
    description: "Double fermented dough, served with crisp fried tilapia, shito, and fresh onion garnish.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtKIjHu6WwUJZ9vyeapSR2ykMxbKqis5JbZrhi2pv8ADpgs9FAWTOBR6IzndAnVypZQezRsL8W3blHprzlPUWQ-1SkL1Ie7E9Ixfl7YeLPAN_4ABh5l5C2nqraWKv7B_qCjrWosFI8gWcsA-MNZKL0Dat8qbFxlHCt-iqwvHCzaVmJfC4w9fHzTOxfNqi4_cxnftW2qwtKQhPxhOR9skU7QW3jVnvHI8YkFCmcDpg2aTKNu1_6pOIjWcKFf16OHrqAh1Hf8Mg6XXQ"
  },
  {
    id: 2,
    name: "Flame Snapper Bowl",
    price: 65.00,
    category: "Flame Grilled",
    description: "Charcoal grilled red snapper marinated in heritage spices, served with soft kenkey and avocado.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBA3_QDm7lgzd_TlPysP1jC2LItdq_NkJdw5UKf3KwSjFskLUf2B_b4ZEIb3sI5EbkhCa6YVqFq0U4bu1RkDGXcFMCgrsR1gH0kN3iRLOoiji1l2dUQVJZZgMCNNRO04_r26wTt_-9dH5rk6qVr7bANctqhXMYLdCJ-dvjxoX1sPQaGjlByMF0uXwjF2SeYtWgN6ylx7-BEKiLPUK181E_o5P-tYcAQHXiDjt2lwdqdRfaG-GjM5Ro-lo-G1azN5Bsv8kr2rhQgQuw"
  },
  {
    id: 3,
    name: "Heritage Shrimp Medley",
    price: 55.00,
    category: "Flame Grilled",
    tag: "Chef's Special",
    description: "Ocean-fresh jumbo shrimp tossed in our signature black pepper rub and roasted garden vegetables.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAT6uNfHB_NoObwWMnX9WsR_Sdkrngi9Ky3w6ow8iYcWYyPYuco7NZWmkXEVpFooFwybO_Tc4nVi5p5Dl_vDqiArf-ZnU8yTKE1JFqO-lTj-1T3cc8pm4mz1FIy2tt14_TlQ3pHgkZMm_4k1vcOtSfkH2s-tO852T6R3hkj8K9pXszbqFhve2dAmReGRlzj8MXyKYlhiuuBt2Fr_sCk1jumcSLoS52Dz-3ra8DeZKvoonK_6ZGqMgsd3DHS8JgvzYaB-1SfRZqcZJs"
  },
  {
    id: 4,
    name: "Village Pot Stew",
    price: 70.00,
    category: "Kenkey Combos",
    description: "Slow-cooked goat meat in a rich palm oil base, infused with anise and scotch bonnet peppers.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdRpb6XncM6q_8qQnWRuiF-efOu8B88miU-uAiHM8BYEviGknR1LTTmBILQoju-ph77Sfc_EsA-03X6octVlnQzUeqt-SyBGGY1A9-ObLVm93wBw4G-sebzCYzD_is3EHVIFupTf2JNmG0QSbbggfnRFITJ-Je-Lc-aENgEenf0KmEmVAM0yX2LAcVlVv39v9b9xiBzVqks12bSF-RPJY23drwdw9dVkHFJQR8rTgrFz3fhOLNKzjDNGppd9sNu5UoUSbQzLu6Uiw"
  },
  {
    id: 5,
    name: "Street Sides Combo",
    price: 35.00,
    category: "Street Sides",
    description: "A platter of spicy gizzard, crispy plantain, and heritage meat pies. Perfect for sharing.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwVx71fTZzGbLfdjuxCCpjTe6qszYFNAdmpUT5tklbabA_B0NK1IAVqJJVM7BLjorQoBT1odrY2ITIb9fGAfEm0dYGTSFRkmy-cvA-DWeWWJg7wknAFdMptviL3_UnpjViCj6oPnfiU5qX0eLFf8fRMrs3ZiPBTP_Chpw5kVuuB1fVvTrLA4Bd8k3BeGIlJIoeDkrc-UU5Oabh2Hdt3d9Rzr4-0991uz1sKW1Knco_3QGUCy8xS27ZIAzTaoRa6lLTYZ94ytvpeXc"
  }
];

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<any>(null); // For mobile detail sheet

  return (
    <PageWrapper>
      {/* Hero Banner */}
      <section className="relative h-[220px] md:h-[460px] flex items-end md:items-center justify-start md:justify-center p-6 md:p-0 overflow-hidden bg-black">
        <img 
          className="absolute inset-0 w-full h-full object-cover grayscale md:brightness-100 brightness-50" 
          alt="Menu hero" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLWLr7RVO-lvUC-IdkXxyCiAaBbwIHTOsKByHz6vCiSWJLPkxvqH6oFUjbaXNvPkKV_1V3dBZPAYErtTGoaVfwBaQBghlHytJCkR7GAQTZv1UYYf3iq7eFPHFZ4-JChZXLw5dL2DtrmYp8Tg-wDtiGz4puWn6AUso113F-QtKFgXeNNC5mQdD3SpJl16Wuxm9IV_JPSvwrOxQNHwbOqg0mYNG3m3lutyY2TeCP05uQccPhaMzW0ZjLOCUUfhYX-1oTSCUjSUWFM6s"
        />
        <div className="absolute inset-0 bg-on-surface/40 hidden md:block"></div>
        <div className="relative z-10 text-left md:text-center md:px-4 w-full">
          <span className="font-dm-sans text-[10px] md:text-sm text-secondary-container block mb-1 md:mb-2 uppercase tracking-widest md:font-bold">The Heritage Kitchen</span>
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-headline font-extrabold text-white md:tracking-tighter leading-none mb-0 md:mb-4 uppercase tracking-tighter">THE MENU</h1>
          <p className="hidden md:block text-surface-container-highest font-body text-xl md:text-2xl max-w-xl mx-auto">Choose your combo. We'll handle the rest.</p>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row flex-1">
        {/* Main Content Area */}
        <div className="flex-1 pb-32 md:pb-20 max-w-6xl mx-auto w-full px-6 md:px-6 lg:px-12 mt-4 md:mt-12">
          
          {/* Filter Row */}
          <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-16 overflow-x-auto pb-4 hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
            {categories.map((c) => (
              <button 
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-6 py-2 md:px-8 md:py-3 whitespace-nowrap font-dm-sans font-bold uppercase tracking-wider text-xs md:text-xs transition-colors border-0 ${
                  activeCategory === c 
                    ? "bg-primary text-white" 
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Item Grid */}
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show"
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-px md:gap-12 bg-surface-container-highest/20 md:bg-transparent -mx-6 px-6 md:mx-0 md:px-0"
          >
            {menuItems.filter(item => activeCategory === "All" || item.category === activeCategory).map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <motion.div 
                  whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="bg-surface group h-full flex flex-col md:p-0 p-4 border border-surface-container-high md:border-0 cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="h-40 md:h-[280px] w-full bg-surface-container-low overflow-hidden relative mb-4 md:mb-0">
                    <motion.img 
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-110" 
                    />
                    {item.tag && (
                      <span className="absolute top-2 left-2 md:top-4 md:left-4 bg-secondary md:bg-secondary text-on-secondary px-2 py-1 md:px-3 md:text-[10px] text-[9px] font-bold uppercase tracking-widest font-dm-sans">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  
                  <div className="md:py-6 flex flex-col flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between items-start mb-2 md:mb-3 font-headline">
                      <h3 className="text-lg md:text-2xl font-bold text-on-surface leading-tight mb-1 md:mb-0">{item.name}</h3>
                      <span className="font-dm-sans text-sm md:text-base font-bold text-secondary md:ml-4 whitespace-nowrap">₵{item.price.toFixed(2)}</span>
                    </div>
                    <p className="hidden md:block text-stone-500 text-sm mb-8 leading-relaxed font-body">
                      {item.description}
                    </p>
                    
                    <div className="mt-auto hidden md:block space-y-4">
                      <PrimaryButton className="w-full py-4 text-xs shadow-none border-b-0" onClick={() => {}}>Add to Cart</PrimaryButton>
                    </div>

                    <div className="mt-auto flex justify-end md:hidden">
                       <button className="w-10 h-10 bg-primary text-white flex items-center justify-center transition-transform active:scale-90">
                         <span className="font-dm-sans font-light text-2xl">+</span>
                       </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}

            <motion.div variants={itemVariants} className="bg-surface group flex flex-col justify-center items-center p-8 border-2 border-dashed border-stone-200">
              <span className="text-stone-300 text-4xl md:text-6xl mb-4 font-dm-sans">+</span>
              <h3 className="text-lg md:text-xl font-headline font-bold text-stone-400 text-center">More Soon</h3>
              <p className="text-stone-400 text-xs md:text-sm text-center hidden md:block mt-2">New seasonal recipes from the archives.</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Sticky Cart Sidebar (Desktop) */}
        <aside className="hidden lg:block w-[400px] h-[calc(100vh-80px)] sticky top-[80px] bg-surface-container-low p-8 border-l border-stone-200/40">
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-baseline mb-8">
              <h2 className="text-3xl font-headline font-bold text-on-surface tracking-tight">Your Order</h2>
              <button className="text-stone-400 text-[10px] uppercase tracking-widest font-bold hover:text-primary transition-colors font-dm-sans">Clear Cart</button>
            </div>
            
            {/* Fulfillment Toggle */}
            <div className="bg-surface p-1 mb-8 flex font-dm-sans">
              <button className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest bg-primary text-on-primary transition-all">Delivery</button>
              <button className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:bg-surface-container transition-all cursor-pointer">Pickup</button>
            </div>
            
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto space-y-6 mb-8 pr-2 hide-scrollbar">
               {menuItems.slice(0, 2).map((item) => (
                 <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-surface-container shrink-0">
                    <img className="w-full h-full object-cover" src={item.image} alt={item.name} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between font-headline font-bold text-sm">
                      <h4>{item.name}</h4>
                      <span>₵{item.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-stone-400 font-dm-sans text-xs">
                      <span>Qty: 1</span>
                      <button className="hover:text-primary transition-colors">Edit</button>
                    </div>
                  </div>
                </div>
               ))}
            </div>
            
            {/* Summary */}
            <div className="border-t border-stone-200/40 pt-6 space-y-4">
              <div className="flex justify-between text-sm text-stone-500 font-body">
                <span>Subtotal</span>
                <span>₵110.00</span>
              </div>
              <div className="flex justify-between text-sm text-stone-500 font-body">
                <span>Heritage Fee</span>
                <span>₵12.00</span>
              </div>
              <div className="flex justify-between text-xl font-headline font-bold text-on-surface pt-4">
                <span>Total</span>
                <span className="text-primary">₵122.00</span>
              </div>
              <Link href="/checkout" className="block">
                <PrimaryButton className="w-full py-5 text-sm gap-3 border-0">
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </PrimaryButton>
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Floating Cart Bar (Mobile) */}
      <div className="lg:hidden fixed bottom-6 left-4 right-4 z-40 bg-[#31302d] text-white h-14 flex items-center px-4 shadow-xl">
        <div className="flex items-center gap-3">
          <ShoppingBag size={20} />
          <motion.span 
            key="2"
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            className="font-dm-sans font-bold text-sm"
          >
            2 ITEMS
          </motion.span>
        </div>
        <div className="mx-auto h-4 w-px bg-white/20"></div>
        <span className="font-dm-sans text-sm font-bold">₵110.00</span>
        <Link href="/checkout" className="ml-auto bg-primary text-white h-full px-4 flex items-center gap-2 font-dm-sans font-bold text-xs uppercase tracking-wider">
          View Cart <ArrowRight size={16} />
        </Link>
      </div>

      {/* Mobile Detail Sheet */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end lg:hidden"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-full bg-surface flex flex-col max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1 bg-surface-container-highest w-12 self-center mt-3 mb-2 rounded-full"></div>
              <div className="relative h-64 w-full shrink-0">
                <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 bg-surface/50 p-2 text-on-surface backdrop-blur-md rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 pb-24">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {selectedItem.tag && (
                      <p className="font-dm-sans text-[10px] text-secondary font-bold uppercase tracking-[0.2em] mb-1">{selectedItem.tag}</p>
                    )}
                    <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight">{selectedItem.name}</h2>
                  </div>
                  <span className="font-headline text-2xl font-bold text-secondary ml-4">₵{selectedItem.price.toFixed(0)}</span>
                </div>
                
                <p className="text-on-surface-variant font-body leading-relaxed mb-8">
                  {selectedItem.description}
                </p>
                
                <div className="flex items-center justify-between gap-4 mt-auto">
                  <div className="flex items-center border-[1.5px] border-outline-variant py-3 px-4 gap-6 shrink-0 bg-white">
                    <button className="text-on-surface"><Minus size={18} /></button>
                    <span className="font-dm-sans font-extrabold text-lg">1</span>
                    <button className="text-on-surface"><Plus size={18} /></button>
                  </div>
                  <PrimaryButton onClick={() => setSelectedItem(null)} className="flex-1 py-4 text-xs shadow-md border-0 bg-primary h-[54px]">
                    Add to Cart
                  </PrimaryButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
