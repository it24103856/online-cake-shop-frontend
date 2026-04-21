import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const toDateOnlyString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function BookingPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [deliveryDate, setDeliveryDate] = useState(today);
  const [showPicker, setShowPicker] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleDateChange = (_event, selectedDate) => {
    if (Platform.OS !== "ios") {
      setShowPicker(false);
    }

    if (!selectedDate) return;

    const normalizedSelected = new Date(selectedDate);
    normalizedSelected.setHours(0, 0, 0, 0);

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (normalizedSelected < now) {
      return;
    }

    setDeliveryDate(normalizedSelected);
  };

  const handleSubmit = async () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (deliveryDate < now) {
      return;
    }

    const bookingPayload = {
      ...formData,
      deliveryDate: toDateOnlyString(deliveryDate),
    };

    console.log("Submit booking", bookingPayload);
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff8f0" }}>
      <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 16 }}>Book Cake Delivery</Text>

      <TextInput placeholder="Name" value={formData.name} onChangeText={(name) => setFormData((prev) => ({ ...prev, name }))} style={{ borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 16, padding: 14, marginBottom: 12, backgroundColor: "white" }} />
      <TextInput placeholder="Phone" value={formData.phone} onChangeText={(phone) => setFormData((prev) => ({ ...prev, phone }))} keyboardType="phone-pad" style={{ borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 16, padding: 14, marginBottom: 12, backgroundColor: "white" }} />
      <TextInput placeholder="Address" value={formData.address} onChangeText={(address) => setFormData((prev) => ({ ...prev, address }))} style={{ borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 16, padding: 14, marginBottom: 12, backgroundColor: "white" }} />

      <Pressable onPress={() => setShowPicker(true)} style={{ padding: 14, borderRadius: 16, backgroundColor: "white", borderWidth: 1, borderColor: "#e5e7eb", marginBottom: 12 }}>
        <Text style={{ fontWeight: "600" }}>Delivery Date: {toDateOnlyString(deliveryDate)}</Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={deliveryDate}
          mode="date"
          display="default"
          minimumDate={today}
          onChange={handleDateChange}
        />
      )}

      <Pressable onPress={handleSubmit} style={{ padding: 16, borderRadius: 16, backgroundColor: "#111827", alignItems: "center" }}>
        <Text style={{ color: "white", fontWeight: "700" }}>Confirm Booking</Text>
      </Pressable>
    </View>
  );
}