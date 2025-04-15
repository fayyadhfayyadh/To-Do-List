import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const Index = () => {
  const [title, setTitle] = useState('');
  const [mapel, setMapel] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('PR');
  const [list, setList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadTask();
  }, []);

  useEffect(() => {
    saveTask();
  }, [list]);

  const addTask = () => {
    if (title.trim() === '' || mapel.trim() === '') return;
    const newTask = {
      id: Date.now().toString(),
      title,
      mapel,
      deadline: deadline || '-',
      category,
      selected: false,
    };
    setList([...list, newTask]);
    resetForm();
  };

  const loadTask = async () => {
    const saved = await AsyncStorage.getItem('task');
    if (saved) setList(JSON.parse(saved));
  };

  const saveTask = async () => {
    await AsyncStorage.setItem('task', JSON.stringify(list));
  };

  const deleteTask = (id: string) => {
    setList(list.filter(item => item.id !== id));
  };

  const startEdit = (item: any) => {
    setTitle(item.title);
    setMapel(item.mapel);
    setDeadline(item.deadline);
    setCategory(item.category);
    setIsEditing(true);
    setEditId(item.id);
  };

  const handleEdit = () => {
    const updated = list.map(item =>
      item.id === editId
        ? { ...item, title, mapel, deadline, category }
        : item
    );
    setList(updated);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setMapel('');
    setDeadline('');
    setCategory('PR');
    setIsEditing(false);
    setEditId(null);
  };

  const TaskCard = ({ item }) => (
    <View style={tw`bg-white p-4 rounded-xl shadow-md mb-4 mx-5`}>
      <Text style={tw`font-bold text-base mb-1`}>{item.title}</Text>
      <Text style={tw`text-xs text-gray-600 mb-1 mt-2`}>📘 Mapel: {item.mapel}</Text>
      <Text style={tw`text-xs text-gray-600 mt-1`}>📅 Deadline: {item.deadline}</Text>
      <Text style={tw`text-xs text-gray-600 mt-1`}>📝 Jenis: {item.category}</Text>

      <View style={tw`flex-row mt-3 gap-2`}>
        <TouchableOpacity
          onPress={() => startEdit(item)}
          style={tw`text-xs px-2 py-1 rounded-full bg-purple-100 `}
        >
          <Text style={tw`text-purple-600 text-xs`}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteTask(item.id)}
          style={tw`text-xs px-2 py-1 rounded-full bg-red-100 `}
        >
          <Text style={tw`text-red-600 text-xs`}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-200`}>
       <View style={tw`bg-[#2A4D50] p-5 rounded-b-3xl`}>
    <View style={tw`flex-row justify-between items-center`}>
      <View>
        <Text style={tw`text-white text-xl `}>My List</Text>
        <Text style={tw`text-white text-sm font-bold text-5 mt-3`}>Hello Fanady👋</Text>
      </View>
      <View style={tw`flex-row items-center gap-3`}>
      </View>
    </View>

    {/* Tab selector */}
    <View style={tw`flex-row bg-white mt-5 rounded-xl overflow-hidden mt-10`}>
      <TouchableOpacity style={tw`flex-1 p-3 bg-[#DDF4E4]`}>
        <Text style={tw`text-center font-bold text-green-800`}>My Tasks</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tw`flex-1 p-3`}>
        <Text style={tw`text-center text-gray-500`}>In-progress</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tw`flex-1 p-3`}>
        <Text style={tw`text-center text-gray-500`}>Completed</Text>
      </TouchableOpacity>
    </View>
  </View>

      {/* Task Form (optional, bisa disembunyiin di modal) */}
      <View style={tw`px-5 mt-6`}>
        <TextInput
          placeholder="Mata pelajaran"
          value={mapel}
          onChangeText={setMapel}
          style={tw`border border-[#2A4D50] rounded-full px-5 py-4 mb-3 bg-white`}
        />
        <TextInput
          placeholder="Judul tugas"
          value={title}
          onChangeText={setTitle}
          style={tw`border border-[#2A4D50] rounded-full px-5 py-4 mb-3 bg-white`}
        />
        <TextInput
          placeholder="Deadline (YYYY-MM-DD)"
          value={deadline}
          onChangeText={setDeadline}
          style={tw`border border-[#2A4D50] rounded-full px-5 py-4 mb-3 bg-white`}
        />
        <View style={tw``}>
          <Picker
            selectedValue={category}
            onValueChange={value => setCategory(value)}
            style={tw`border border-[#2A4D50] rounded-full mb-3 h-12 px-4`}
          >
            <Picker.Item label="PR" value="PR" />
            <Picker.Item label="Mapel" value="Mapel" />
            <Picker.Item label="Tugas" value="Tugas" />
          </Picker>
        </View>
        <TouchableOpacity
          onPress={isEditing ? handleEdit : addTask}
          style={tw`bg-[#2A4D50] py-3 rounded-xl`}
        >
          <Text style={tw`text-center text-white font-bold`}>
            {isEditing ? 'Update' : 'Tambah Tugas'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <FlatList
        data={list}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TaskCard item={item} />}
        contentContainerStyle={tw`pt-5 pb-10`}
      />
    </SafeAreaView>
  );
};

export default Index;
