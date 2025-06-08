//Abhi Patel
//BTP 610 - Assignemnt 2 - XPRESS POST

import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  Alert,
} from 'react-native';

export default function App() {
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [parcelType, setParcelType] = useState('');
  const [weight, setWeight] = useState('');
  const [weightError, setWeightError] = useState('');
  const [dropDownValue, setDropDownValue] = useState(null);
  const [ratePrice, setRatePrice] = useState(null);
  const [addOnSelected, setAddOnSelected] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState({});

  const parcelOptions = ['Package', 'Letter/Document'];

  // Validation:
  const [fromError, setFromError] = useState('');
  const [toError, setToError] = useState('');
  const [typeError, setTypeError] = useState('');
  const [rateError, setRateError] = useState('');

  const rateData = {
    'Package': [
      { label: 'Standard ($12.99)', price: 12.99 },
      { label: 'Xpress Post ($18.99)', price: 18.99 },
      { label: 'Priority Post ($24.99)', price: 24.99 },
    ],
    'Letter/Document': [
      { label: 'Standard ($4.99)', price: 4.99 },
      { label: 'Xpress Post ($9.99)', price: 9.99 },
      { label: 'Priority Post ($14.99)', price: 14.99 },
    ],
  };

  console.log('Selected parcel type:', parcelType);

  const handleButtonClick = () => {
  let hasError = false;
  const numericWeight = parseFloat(weight);

  setFromError('');
  setToError('');
  setTypeError('');
  setWeightError('');
  setRateError('');
  
  //Validation chekcs
  if (fromAddress === '' || fromAddress === ' ' || fromAddress === '  ') {
    setFromError('*Shipping From address is required.');
    hasError = true; //only print if input missing
  }

  if (toAddress === '' || toAddress === ' ' || toAddress === '  ') {
    setToError('*Shipping To address is required.');
    hasError = true;//only print if input missing
  }

  if (!parcelType) {
    setTypeError('*Please select a parcel type.');
    hasError = true;//only print if input missing
  }

  if (weight === '' || weight === ' ' || weight === '  ') {
    setWeightError('*Parcel weight is required.');
    hasError = true;
  } else if (parcelType === 'Package' && numericWeight > 44) {
    setWeightError('*Max allowed weight for Package is 44 lbs.');
    hasError = true;
  } else if (parcelType === 'Letter/Document' && numericWeight > 1.1) {
    setWeightError('*Max allowed weight for Letter/Document is 1.1 lbs.');
    hasError = true;
  }

  if (!dropDownValue) {
    setRateError('*Please choose a rate.');
    hasError = true;
  }

  if (hasError) {
    Alert.alert(
      "Form Incomplete",
      "Please ensure all fields are correctly filled before proceeding.",
      [{ text: "OK", style: "default" }]
    );
    return;
  }

  // Determine additional charge for the signature option
  const addOnPrice = addOnSelected ? 2 : 0;

  // Calculate subtotal by adding base rate and signature fee
  const subTotal = ratePrice + addOnPrice;

  // Calculate 13% tax on the subtotal
  const tax = +(subTotal * 0.13).toFixed(2);

  // Final total = subtotal + tax
  const total = +(subTotal + tax).toFixed(2);

  //MModal data values to show on modal summary
  setModalData({
    fromAddress,
    toAddress,
    parcelType,
    dropDownValue,
    ratePrice,
    addOnSelected,
    addOnPrice,
    subTotal,
    tax,
    total,
  });
  setIsModalVisible(true);
};

  return (
    <View style={styles.container}>

      {/* header */}
      <Text style={styles.header}>XPRESS POST</Text>

      {/* Input boxes */}
      <Text style={styles.label}>Shipping From:</Text>
      <TextInput
        style={styles.inputStyle}
        value={fromAddress}
        placeholder="Enter Address Sending From:"
        onChangeText={setFromAddress}
      />
      {fromError ? <Text style={styles.errorText}>{fromError}</Text> : null}

      <Text style={styles.label}>Shipping To:</Text>
      <TextInput
        style={styles.inputStyle}
        value={toAddress}
        placeholder="Enter Address Sending To:"
        onChangeText={setToAddress}
      />
      {toError ? <Text style={styles.errorText}>{toError}</Text> : null}

      {/* Radio options */}
      <Text style={styles.label}>Parcel Type</Text>
      <View style={styles.radioContainer}>
        {parcelOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.radioOption}
            onPress={() => setParcelType(option)}
          >
            <View style={styles.radioCircle}>
              {parcelType === option && <View style={styles.radioSelected} />}
            </View>
            <Text style={styles.radioLabel}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {typeError ? <Text style={styles.errorText}>{typeError}</Text> : null}

      {/* Parcel weight */}
      <Text style={styles.label}>Parcel Weight (lbs)</Text>
      <TextInput
        style={styles.inputStyle}
        value={weight}
        placeholder="Enter weight (only numeric digits)"
        onChangeText={(value) => {
          setWeight(value);
          setWeightError('');
        }}
      />
      {weightError ? <Text style={styles.errorText}>{weightError}</Text> : null}

      {/* picker option renders dpeending on the parcel type */}
      {parcelType ? (
        <View style={{ width: '100%' }}>
          <Text style={styles.label}>Choose Rate</Text>
          <Picker
            selectedValue={dropDownValue}
            style={styles.dropDownStyle}
            onValueChange={(itemValue, itemIndex) => {
              setDropDownValue(itemValue);
              const selectedRate = rateData[parcelType].find(item => item.label === itemValue);
              setRatePrice(selectedRate ? selectedRate.price : null);
            }}
          >
            <Picker.Item label="Select a rate..." value={null} />
            {rateData[parcelType].map((option, index) => (
              <Picker.Item key={index} label={option.label} value={option.label} />
            ))}
          </Picker>
          {rateError ? <Text style={styles.errorText}>{rateError}</Text> : null}

          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setAddOnSelected(prev => !prev)}
          >
            <View style={styles.radioCircle}>
              {addOnSelected && <View style={styles.radioSelected} />}
            </View>
            <Text style={styles.radioLabel}>Signature Option (+$2)</Text>
          </TouchableOpacity>
        </View>
      ) : null}

    {/* Get rates button */}
      <Pressable style={styles.buttonStyle} onPress={handleButtonClick}>
        <Text style={styles.buttonText}>Get Parcel Rates</Text>
      </Pressable>

      {/* Modal view after pressing button */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Order Summary</Text>
          <Text style={styles.summaryItem}>From: {modalData.fromAddress}</Text>
          <Text style={styles.summaryItem}>To: {modalData.toAddress}</Text>
          <Text style={styles.summaryItem}>Parcel: {modalData.parcelType}</Text>
          <Text style={styles.summaryItem}>Rate: {modalData.dropDownValue}</Text>
          <Text style={styles.summaryItem}>Base Cost: ${modalData.ratePrice?.toFixed(2)}</Text>
          {modalData.addOnSelected && <Text style={styles.summaryItem}>Add-on: +${modalData.addOnPrice?.toFixed(2)}</Text>}
          <Text style={styles.summaryItem}>Subtotal: ${modalData.subTotal?.toFixed(2)}</Text>
          <Text style={styles.summaryItem}>Tax (13%): ${modalData.tax?.toFixed(2)}</Text>
          <Text style={styles.summaryItem}>Total: ${modalData.total?.toFixed(2)}</Text>

          <TouchableOpacity
            style={[styles.buttonStyle, { marginTop: 20 }]}
            onPress={() => setIsModalVisible(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffcc00',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 40,
    paddingHorizontal: 15,
  },
// ----------------------------HEADER----------------------------
  header: {
    color: '#d4040f',
    fontSize: 22,
    fontWeight: 'bold',
  },
//----------------------------INPPUT BOX STYLING----------------------------
  inputStyle: {
    fontSize: 18,
    borderColor: '#d4040f',
    borderWidth: 2,
    padding: 8,
    height: 50,
    width: '100%',
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: 'white',
  },
// ----------------------------TEXT LABEL STYLING----------------------------
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },

  //----------------------------RADIO STYLING----------------------------
  radioContainer: {
    width: '100%',
    marginTop: 10,
  },

  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },

  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d4040f',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  radioSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#d4040f',
  },

  radioLabel: {
    fontSize: 16,
  },

  //----------------------------BUTTON STYLING----------------------------
  buttonStyle: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 45,
    borderRadius: 5,
    backgroundColor: '#d4040f',
  },

  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '700',
  },

  //----------------------------ERROR LABEL----------------------------
  errorText: {
    fontSize: 14,
    color: '#d4040f',
    fontWeight: 'bold',
    marginTop: 5,
  },

  //----------------------------PICKER STLING----------------------------
  dropDownStyle: {
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#ffcc00',
    marginTop: 5,
  },

  //----------------------------MODAL STYLING----------------------------
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    // height: '60%',
    justifyContent: 'flex-start',
  },

  modalText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#d4040f',
    textAlign: 'center',
  },

  summaryItem: {
  fontSize: 18,
  marginBottom: 10,
  color: '#333',
},
});
