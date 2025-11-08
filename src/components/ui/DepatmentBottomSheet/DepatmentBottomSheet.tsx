import { useState } from 'react'

import { View, Text, TouchableOpacity } from 'react-native'

import { DEPARTMENTS_BY_COLLEGE } from '@/constants/collge'
import { useNetworkGuard } from '@/hooks/useNetworkGuard'
import { showInfoToast, showSuccessToast } from '@/utils/toastUtils'

interface DepatmentBottomSheetProps {
  selectedDepartments?: string[]
  onDepartmentsUpdate?: (departments: string[]) => void
  onComplete?: () => void
}

// 학과 ID를 학과 이름으로 변환하는 헬퍼 함수
const getDepartmentNameById = (
  departmentId: string,
  collegeKey: string
): string => {
  const college =
    DEPARTMENTS_BY_COLLEGE[collegeKey as keyof typeof DEPARTMENTS_BY_COLLEGE]
  if (!college) return departmentId

  const department = college.departments.find(
    (dept) => dept.id === departmentId
  )
  return department ? department.name : departmentId
}

export const DepatmentBottomSheet = ({
  selectedDepartments: initialSelectedDepartments = [],
  onDepartmentsUpdate,
  onComplete,
}: DepatmentBottomSheetProps) => {
  const [step, setStep] = useState<'college' | 'department'>('college')
  const [selectedCollege, setSelectedCollege] = useState<string>('')
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(
    initialSelectedDepartments
  )
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 7
  const { ensureOnline } = useNetworkGuard()

  const colleges = Object.keys(DEPARTMENTS_BY_COLLEGE)
  const currentCollege =
    DEPARTMENTS_BY_COLLEGE[
      selectedCollege as keyof typeof DEPARTMENTS_BY_COLLEGE
    ]

  // 현재 페이지의 학과들만 가져오기
  const getCurrentPageDepartments = () => {
    if (!currentCollege) return []
    const startIndex = currentPage * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return currentCollege.departments.slice(startIndex, endIndex)
  }

  // 전체 페이지 수 계산
  const totalPages = currentCollege
    ? Math.ceil(currentCollege.departments.length / itemsPerPage)
    : 0

  // 페이지네이션 함수들
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleCollegeSelect = (collegeKey: string) => {
    setSelectedCollege(collegeKey)
    setStep('department')
    setCurrentPage(0) // 학과 선택으로 넘어가면 페이지 리셋
  }

  const handleDepartmentSelect = (departmentId: string) => {
    if (!ensureOnline()) {
      showInfoToast(
        '오프라인 상태입니다',
        '네트워크 연결 후 다시 시도해 주세요.'
      )
      return
    }
    const departmentName = getDepartmentNameById(departmentId, selectedCollege)

    let newSelectedDepartments: string[]
    if (selectedDepartments.includes(departmentName)) {
      // 이미 선택된 학과는 해제
      newSelectedDepartments = []
    } else {
      // 새로 선택하려는 경우, 단일 선택이므로 기존 선택을 모두 해제하고 새로 선택
      newSelectedDepartments = [departmentName]
    }

    // 상태 업데이트
    setSelectedDepartments(newSelectedDepartments)
    // 실시간으로 상위 컴포넌트에 업데이트 전달
    onDepartmentsUpdate?.(newSelectedDepartments)
  }

  const handleComplete = () => {
    if (!ensureOnline()) {
      showInfoToast(
        '오프라인 상태입니다',
        '네트워크 연결 후 다시 시도해 주세요.'
      )
      return
    }
    // 바텀시트만 닫기 (선택 상태는 이미 상위 컴포넌트에 전달됨)
    showSuccessToast('학과 선택이 저장되었어요')
    onComplete?.()
  }

  const renderCollegeStep = () => {
    return (
      <>
        <Text className="mb-6 text-center text-lg font-semibold">
          단과대학 선택
        </Text>

        {/* 그리드 레이아웃으로 단과대학 목록 표시 (2열, 한 화면에 모두 표시) */}
        <View style={{ flex: 1, marginBottom: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {colleges.map((collegeKey) => {
              const college =
                DEPARTMENTS_BY_COLLEGE[
                  collegeKey as keyof typeof DEPARTMENTS_BY_COLLEGE
                ]
              return (
                <TouchableOpacity
                  key={collegeKey}
                  className="mb-3 rounded-lg border border-gray-200 bg-white p-4"
                  style={{
                    width: '48%', // 2열 그리드 (약간의 간격을 위해 48%)
                    minHeight: 70,
                    justifyContent: 'center',
                  }}
                  onPress={() => handleCollegeSelect(collegeKey)}
                >
                  <Text
                    className="text-lg font-medium text-gray-900"
                    numberOfLines={2}
                    style={{ textAlign: 'center' }}
                  >
                    {college.title}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </>
    )
  }

  const renderDepartmentStep = () => {
    const currentDepartments = getCurrentPageDepartments()

    return (
      <>
        {/* 헤더 부분 */}
        <View className="mb-6 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => {
              setStep('college')
              setCurrentPage(0) // 페이지 리셋
            }}
            className="mr-2 p-2"
          >
            <Text className="font-semibold text-gray-600">← 뒤로</Text>
          </TouchableOpacity>
          <Text className="flex-1 text-center text-lg font-semibold">
            {currentCollege?.title}
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (!ensureOnline()) {
                showInfoToast(
                  '오프라인 상태입니다',
                  '네트워크 연결 후 다시 시도해 주세요.'
                )
                return
              }
              const newSelectedDepartments: string[] = []
              setSelectedDepartments(newSelectedDepartments)
              onDepartmentsUpdate?.(newSelectedDepartments) // 상위 컴포넌트에도 전달
            }}
            className="ml-2 p-2"
          >
            <Text className="font-semibold text-blue-600">초기화</Text>
          </TouchableOpacity>
        </View>

        {/* 부제 부분 */}
        <Text className="mb-4 text-center text-sm text-gray-600">
          구독할 학과를 선택하세요
        </Text>

        {/* 현재 페이지 학과 목록 */}
        <View className="mb-4 flex-1">
          {currentDepartments.map((department) => (
            <TouchableOpacity
              key={department.id}
              className={`mb-3 flex-row items-center justify-between rounded-lg border p-4 ${
                selectedDepartments.includes(
                  getDepartmentNameById(department.id, selectedCollege)
                )
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
              onPress={() => handleDepartmentSelect(department.id)}
            >
              <Text
                className={`flex-1 text-base ${
                  selectedDepartments.includes(
                    getDepartmentNameById(department.id, selectedCollege)
                  )
                    ? 'font-semibold text-blue-700'
                    : 'font-medium text-gray-900'
                }`}
              >
                {department.name}
              </Text>
              <View
                className={`ml-4 h-6 w-6 items-center justify-center rounded-full border-2 ${
                  selectedDepartments.includes(
                    getDepartmentNameById(department.id, selectedCollege)
                  )
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {selectedDepartments.includes(
                  getDepartmentNameById(department.id, selectedCollege)
                ) && <Text className="text-sm font-bold text-white">✓</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 페이지네이션 컨트롤 */}
        <View className="mb-4">
          <View className="mb-4 flex-row items-center justify-between">
            <TouchableOpacity
              className={`rounded-lg px-4 py-2 ${
                currentPage === 0 ? 'bg-gray-200' : 'bg-blue-500'
              }`}
              onPress={goToPreviousPage}
              disabled={currentPage === 0}
            >
              <Text
                className={`font-semibold ${
                  currentPage === 0 ? 'text-gray-400' : 'text-white'
                }`}
              >
                이전
              </Text>
            </TouchableOpacity>

            <Text className="text-sm text-gray-600">
              {currentPage + 1} / {totalPages}
            </Text>

            <TouchableOpacity
              className={`rounded-lg px-4 py-2 ${
                currentPage === totalPages - 1 ? 'bg-gray-200' : 'bg-blue-500'
              }`}
              onPress={goToNextPage}
              disabled={currentPage === totalPages - 1}
            >
              <Text
                className={`font-semibold ${
                  currentPage === totalPages - 1
                    ? 'text-gray-400'
                    : 'text-white'
                }`}
              >
                다음
              </Text>
            </TouchableOpacity>
          </View>

          {/* 페이지 인디케이터 */}
          <View className="flex-row justify-center">
            {Array.from({ length: totalPages }, (_, index) => (
              <View
                key={index}
                className={`mx-1 h-2 w-2 rounded-full ${
                  index === currentPage ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </View>
        </View>

        {/* 완료 버튼 */}
        {selectedDepartments.length > 0 && (
          <TouchableOpacity
            className="mb-2 rounded-lg bg-blue-500 p-4"
            onPress={handleComplete}
          >
            <Text className="text-center text-lg font-semibold text-white">
              선택 완료 ({selectedDepartments.length}/1개 선택)
            </Text>
          </TouchableOpacity>
        )}
      </>
    )
  }

  return (
    <View className="bg-white" style={{ flex: 1, padding: 16 }}>
      {step === 'college' ? renderCollegeStep() : renderDepartmentStep()}
    </View>
  )
}
